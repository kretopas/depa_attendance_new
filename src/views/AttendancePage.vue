<template>
	<h1 class="page-title">{{ pageTitle }}</h1>
	<div class="container-fluid root" v-if="isMapChecked && userProfile">
		<div>
			ผู้ใช้งาน: <strong>{{ userProfile.displayName }}</strong> <span v-if="userEmpCode">({{ userEmpCode }})</span>
		</div>
		<div class="btn-row">
			<button type="button" class="btn btn-success btn-block" v-if="isCheckedIn == false" @click="timeRecord">
				<font-awesome-icon :icon="['fas', 'clock']"/> ลงเวลาเข้า
			</button>
			<button type="button" class="btn btn-danger btn-block" v-else-if="isCheckedIn == true" @click="timeRecord">
				<font-awesome-icon :icon="['fas', 'clock-rotate-left']"/> ลงเวลาออก
			</button>
			<button type="button" class="btn btn-info btn-block" v-if="isWFH == false" @click="isModal = true">
				<font-awesome-icon :icon="['fas', 'location-dot']"/> ปฏิบัติงานนอกสถานที่
			</button>
		</div>
		<teleport to="body">
			<div class="modal" v-if="isModal">
				<div>
					<h3 align="center"> ลงทะเบียนปฏิบัติงานนอกสถานที่ </h3>
					<form class="form-box">
						<div class="form-group row">
							<label for="latitudeWFH" class="col-sm-2 col-form-label">ละติจูด</label>
							<div class="col-sm-10">
								<input type="text" id="latitudeWFH"
								v-model="positionCurrent.lat" class="form-control"
								:disabled="true" :readonly="true"/>
							</div>
						</div>
						<div class="form-group row">
							<label for="longitudeWFH" class="col-sm-2 col-form-label">ลองจิจูด</label>
							<div class="col-sm-10">
								<input type="text" id="longitudeWFH"
								v-model="positionCurrent.lng" class="form-control"
								:disabled="true" :readonly="true"/>
							</div>
						</div>
					</form>
					<div class="btn-row" align="center">
						<button type="button" class="btn btn-success btn-block" @click="registerCoordinate">ลงทะเบียน</button>
						<button type="button" class="btn btn-danger btn-block" @click="isModal = false">ยกเลิก</button>
					</div>
					<div class="form-box" align="center">
						<span class="false-text">*หมายเหตุ: </span>สามารถลงทะเบียนได้เพียงครั้งเดียวเท่านั้น<br/>
						หากต้องการเปลี่ยนพิกัด กรุณาติดต่อฝ่ายทรัพยากรองค์กรและบุคคล
					</div>
				</div>
			</div>
		</teleport>
		<GMapMap
		class="map"
		map-type-id="terrain"
		:center="positionCurrent"
		:zoom="16"
		:options="mapOptions"
		>
			<GMapMarker
			:position="positionCurrent"
			:clickable="false"
			:draggable="false"
			/>
			<GMapCircle
			v-for="(pin, index) in circlePositions"
			:key="index"
			:center="pin"
			:radius="requiresDistance"
			:options="circleOptions"
			/>
		</GMapMap>
		<div class="btn-row">
			<router-link to="/history">
				<button type="button" class="btn btn-outline-primary" v-if="userProfile" >
					<font-awesome-icon :icon="['fas', 'clipboard']" /> ประวัติการลงเวลา
				</button>
			</router-link>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import liff from '@line/liff';
import Swal from 'sweetalert2';
import helper from '@/helpers/helper';
import UserService from '@/services/user.service';
import AttendanceService from '@/services/attendance.service';

export default {
	name: 'AttendancePage',
	async mounted() {
		try {
			helper.loadingAlert("กำลังตรวจสอบตำแหน่งปัจจุบัน");
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((result) => {
					const position = {lat: result.coords.latitude, lng: result.coords.longitude};
					this.positionCurrent = position;
					this.isMapChecked = true;
					AttendanceService.getAllLocation().then(
						(locations) => {
							locations.forEach((location) => {
								this.circlePositions.push({lat: parseFloat(location.latitude), lng: parseFloat(location.longitude)});
							})
						},
						(error) => {
							helper.failAlert(undefined, error);
						}
					);
					helper.closeAlert();
					this.checkUser();
				})
			}
		} catch (error) {
			helper.failAlert("ไม่สำเร็จ", error)
		}
	},
	data() {
		return {
			pageTitle: 'ลงเวลาปฏิบัติงาน',
			userEmpCode: null,
			isWFH: null,
			isCheckedIn: null,
			isMapChecked: false,
			isModal: false,
			positionCurrent: {},
			positionWFH: {},
			circlePositions: [],
			requiresDistance: 300,
			startCheckIn: process.env.VUE_APP_START_CHECKIN_TIME,
			startCheckOut: process.env.VUE_APP_START_CHECKOUT_TIME,
			endCheckIn: process.env.VUE_APP_END_CHECKIN_TIME,
			endCheckOut: process.env.VUE_APP_END_CHECKOUT_TIME,
			apiKey: process.env.VUE_APP_GOOGLE_MAP_API_KEY,
			mapOptions: {
				zoomControl: false,
				mapTypeControl: false,
				gestureHandling: 'none',
				scaleControl: false,
				streetViewControl: false,
				rotateControl: false,
				fullscreenControl: false,
				disableDefaultUi: true,
				clickable: false,
				clickableIcons: false
			},
			circleOptions: {
				strokeColor: "#468284",
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: "#ADD8E6",
				fillOpacity: 0.35
			}
		}
	},
	methods: {
		checkRegisterData(empCode, email) {
			var check = false;
			var message = '';
			if (!helper.isNumeric(empCode)) {
				message = 'กรุณากรอกรหัสพนักงานเป็นตัวเลขเท่านั้น';
			} else if (email.split("@")[1] != "depa.or.th") {
				message = 'กรุณากรอกอีเมลด้วยโดเมน @depa.or.th';
			} else {
				check = true;
			}
			return {status: check, error: message}
		},
		checkUser() {
			UserService.getUser(this.userProfile.userId).then(
				async (data) => {
					if (data) {
						this.userEmpCode = data.emp_code;
						this.isCheckedIn = Boolean(parseInt(data.checked));
						if (data.latitude_WFH != null && data.longitude_WFH != null) {
							const position = {lat: parseFloat(data.latitude_WFH), lng: parseFloat(data.longitude_WFH)};
							this.circlePositions.push(position);
							this.positionWFH = position;
							this.isWFH = true;
						}
					} else {
						const steps = ['1', '2']
						const questions = ['กรุณากรอกรหัสพนักงาน', ['กรุณากรอกอีเมลพนักงาน']]
						const inputHolder = ['รหัสพนักงาน', 'อีเมลพนักงาน (@depa.or.th)']
						const inputMaxLength = [7, 50]
						const swalQueueStep = Swal.mixin({
							confirmButtonText: 'ถัดไป',
							cancelButtonText: 'ย้อนกลับ',
							progressSteps: steps,
							input: 'text',
							inputAttributes: {
								required: true
							},
							reverseButtons: true,
							validationMessage: 'This field is required'
						})
						let inputs = []
						let currentStep;
						for (currentStep = 0; currentStep < steps.length;) {
							const result = await swalQueueStep.fire({
								title: `${questions[currentStep]}`,
								inputValue: inputs[currentStep],
								showCancelButton: currentStep > 0,
								currentProgressStep: currentStep,
								inputPlaceholder: `${inputHolder[currentStep]}`,
								inputAttributes: {
									maxLength: `${inputMaxLength[currentStep]}`
								}
							})

							if (result.value) {
								inputs[currentStep] = result.value;
								currentStep++;
							} else if (result.dismiss === Swal.DismissReason.cancel) {
								currentStep--;
							} else {
								break;
							}
						}
						if (currentStep === steps.length) {
							if (inputs[0] && inputs[1]) {
								const registerEmpCode = inputs[0];
								const registerEmail = inputs[1].toLowerCase();
								const checkResult = this.checkRegisterData(registerEmpCode, registerEmail);
								if (checkResult.status == true) {
									helper.loadingAlert();
									UserService.addUser(this.userProfile.userId, registerEmpCode, registerEmail).then(
										async (user) => {
											if (user) {
												helper.successAlert(undefined, `ทำการผูกบัญชีกับอีเมล ${registerEmail} แล้ว`)
											} else {
												Swal.fire({
													icon: 'question',
													text: 'รหัสพนักงานนี้ถูกใช้งานแล้ว ท่านต้องการแทนที่หรือไม่?',
													confirmButtonText: 'ยืนยัน',
													showCancelButton: true,
													cancelButtonText: 'ยกเลิก'
												}).then((result) => {
													if (result.isConfirmed) {
														UserService.updateUser(this.userProfile.userId, registerEmpCode, registerEmail).then(
															async (update) => {
																if (update) {
																	helper.successAlert(undefined, `ทำการผูกบัญชีใหม่กับอีเมล ${registerEmail} แล้ว`)
																} else {
																	helper.failAlertWithCallback(undefined, 'อีเมลที่กรอก ไม่ตรงกับในฐานข้อมูล')
																}
															},
															(error) => {
																helper.failAlertWithCallback(undefined, error)
															}
														)
													} else {
														location.reload();
													}
												})
											}
										},
										(error) => {
											helper.failAlertWithCallback(undefined, error)
										}
									)
								} else {
									helper.failAlertWithCallback(undefined, checkResult.error)
								}
							} else {
								helper.failAlertWithCallback(
									'ไม่สำเร็จ',
									'กรุณากรอกรหัสพนักงานและอีเมลให้เรียบร้อย'
								)
							}
						}
					}
				},
				(error) => {
					helper.failAlert(undefined, error);
				}
			)
		},
		checkTime() {
			const today = new Date();
			const time = today.getHours();
			if (!this.isCheckedIn) {
				if (time >= this.startCheckIn && time < this.endCheckIn) {
					return true;
				}
			} else {
				if (time >= this.startCheckOut && time < this.endCheckOut) {
					return true;
				}
			}
			return false;
		},
		async timeRecord() {
			if (this.checkTime()) {
				helper.loadingAlert();
				const distanceOffice = await AttendanceService.checkLocationOffice(this.positionCurrent).then(
					(distance) => {
						if (distance <= this.requiresDistance) {
							return true;
						} else {
							return false;
						}
					},
					(error) => {
						helper.failAlert(undefined, error);
					}
				)
				const distanceWFH = this.isWFH ? 
									(AttendanceService.checkLocationWFH(
										this.positionCurrent,
										this.positionWFH) <= this.requiresDistance) :
									false;

				if (distanceOffice || distanceWFH) {
					AttendanceService.insertTimeRecord(
						this.userProfile.userId,
						this.positionCurrent,
						this.isCheckedIn).then(
							() => {
								helper.successAlert(undefined, 'ลงเวลาสำเร็จ', () => {
									liff.closeWindow();
									location.reload();
								})
							},
							(error) => {
								helper.failAlert(undefined, error);
							}
						)
				} else {
					helper.failAlertWithCallback('ตำแหน่งไม่ถูกต้อง', 'คุณอยู่นอกระยะที่กำหนดไว้<br/>กรุณาติดต่อฝ่ายทรัพยากรองค์กรและบุคคล');
				}
				
			} else {
				if (!this.isCheckedIn) {
					helper.failAlert('นอกระยะเวลา', `กรุณาลงเวลาเข้าในช่วง ${this.startCheckIn}.00 - ${this.endCheckIn - 1}.59 นาฬิกา`)
				} else {
					helper.failAlert('นอกระยะเวลา', `กรุณาลงเวลาออกในช่วง ${this.startCheckOut}.00 - ${this.endCheckOut - 1}.59 นาฬิกา`)
				}
			}
		},
		registerCoordinate() {
			Swal.fire({
				icon: 'question',
				text: 'ลงทะเบียนพิกัดนี้ เพื่อใช้สำหรับลงเวลาปฏิบัติงานนอกสถานที่หรือไม่?',
				confirmButtonText: 'ยืนยัน',
				showCancelButton: true,
				cancelButtonText: 'ยกเลิก'
			}).then((result) => {
				if (result.isConfirmed) {
					helper.loadingAlert();
					AttendanceService.registerCoordinate(this.userProfile.userId, this.positionCurrent).then(
						() => {
							helper.successAlert(undefined, 'ลงทะเบียนพิกัดของคุณแล้ว', () => {
								location.reload();
							})
						},
						(error) => {
							helper.failAlert(undefined, error);
						}
					)
				}
			});
		}
	},
	computed: {
		...mapGetters(['userProfile'])
	}
}
</script>

<style scoped>
.map {
	position: relative;
	width: 100%;
	height: 300px;
	left: 50%;
	transform: translateX(-50%);
}

.root {
	position: relative;
}
.modal {
	position: absolute;
	top: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.1);
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.modal > div {
	background-color: #fff;
	padding: 50px;
	border-radius: 10px;
	justify-content: center;
	align-items: center;
}

</style>