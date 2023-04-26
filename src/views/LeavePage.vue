<template>
	<h1 class="page-title"><span>{{ pageTitle }}</span></h1>
	<div class="container" v-if="userProfile && userData">
		<div>
			ผู้ใช้งาน: <strong>{{ userProfile.displayName }}</strong> <span v-if="userData">({{ userData.emp_code }})</span>
		</div>
		<div class="form-box">
			<table width="80%" class="table table-bordered" v-if="leaveQuotas">
				<thead class="table-dark">
					<tr>
						<th scope="col">ประเภทวันลา</th>
						<th scope="col">โควต้า</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(row, index) in leaveQuotas" :key="index" :class="{'highlight': (row.name == selectedLeaveType)}">
						<td>{{ row.name_th }}</td>
						<td v-if="row.quota <= 0"><span class="false-text"><strong>0</strong> วัน</span></td>
						<td v-else><span><strong>{{row.quota}}</strong> วัน</span></td>
					</tr>
				</tbody>
			</table>
		</div>
		<div v-if="leaveTypeOptions">
			<form @submit.prevent="sendLeaveRequest" class="form-box">
				<div class="form-group row">
					<label for="leaveType" class="col-sm-3 col-form-label">ประเภทการลา</label>
					<div class="col-sm-9">
						<select class="form-select"
						v-model="selectedLeaveType" id="leaveType"
						required>
							<option :value="null" disabled hidden>-- เลือกประเภทการลา --</option>
							<option v-for="(type, index) in leaveTypeOptions" :value="type.name" v-bind:key="index">
								{{ type.name_th }} 
							</option>
						</select>
					</div>
				</div>
				<div class="form-group row">
					<label for="startDate" class="col-sm-3 col-form-label">ระหว่างวันที่</label>
					<div class="col-sm-4">
						<VueDatePicker
						v-model="startDate"
						:model-value="startDate"
						timezone="Asia/Bangkok"
						:enable-time-picker="false"
						:format="startDateFormat"
						:clearable="false"
						:disabled-week-days="[6, 0]"
						:disabled-dates="getDisabledDates"
						auto-apply
						required
						@update:model-value="selectStartDate"
						></VueDatePicker>
					</div>
					<label for="endDate" class="col-sm-1 col-form-label">ถึง</label>
					<div class="col-sm-4">
						<VueDatePicker
						v-model="endDate"
						:model-value="endDate"
						timezone="Asia/Bangkok"
						:enable-time-picker="false"
						:format="endDateFormat"
						:clearable="false"
						:disabled="isHalfDay"
						:disabled-week-days="[6, 0]"
						:disabled-dates="getDisabledDates"
						auto-apply
						required
						@update:model-value="selectEndDate"
						></VueDatePicker>
					</div>
				</div>
				<div class="form-group row">
					<label for="isHalfDay" class="col-sm-3 col-form-label">ครึ่งวัน</label>
					<div class="col-sm-4">
						<input type="checkbox" class="form-check-input" v-model="isHalfDay" @change="checkHalfday()"/>
					</div>
				</div>
				<div class="form-group row" v-if="isHalfDay">
					<label for="selectHalfDay" class="col-sm-3 col-form-label">เลือกช่วงเวลา</label>
					<div class="col-sm-3">
						<select class="form-select"
						v-model="selectedHalfDay" id="selectHalfDay"
						:required="isHalfDay">
							<option :value="null" disabled hidden>-- เลือกช่วงเวลา --</option>
							<option v-for="(type, index) in halfDayOptions" :value="type.value" v-bind:key="index">
								{{ type.label }} 
							</option>
						</select>
					</div>
				</div>
				<div class="form-group row">
					<label for="description" class="col-sm-3 col-form-label">รายละเอียด</label>
					<div class="col-sm-9">
						<textarea cols="50" rows="4" class="form-control"
						id="description" v-model="description"
						required
						/>
					</div>
				</div>
				<div class="form-group row mb-3">
					<label for="attachment" class="col-sm-3 col-form-label">เอกสารแนบ</label>
					<div class="col-sm-9">
						<input type="file" class="form-control"
						id="attachment" name="attachment"
						@change="selectFile($event.target.files)"/>
					</div>
				</div>
				<div class="form-group row">
					<label for="requestDays" class="col-sm-3 col-form-label">รวม (วัน)</label>
					<div class="col-sm-9">
						<input type="number" class="form-control"
						v-model="requestDays"
						:disabled="true" :readonly="true"/>
					</div>
				</div>
				<div class="btn-row">
					<button class="btn btn-primary btn-block">ส่งคำขอการลา</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import helper from '@/helpers/helper';
import Swal from 'sweetalert2';
import { mapGetters } from 'vuex';
import UserService from '@/services/user.service';
import LeaveService from '@/services/leave.service';

export default {
	name: 'LeavePage',
	async mounted() {
		try {
			helper.loadingAlert();
			UserService.getUser(this.userProfile.userId).then(
				(user) => {
					this.userData = user;
					LeaveService.getLeaveQuota(this.userData.emp_code).then(
						(quotas) => {
							this.leaveQuotas = quotas;
							this.leaveTypeOptions = quotas.filter((type) => {
								return type.display === true;
							});
						}
					);
					LeaveService.getHolidays().then(
						(holidays) => {
							this.allHolidays = holidays;
						}
					);
					this.startDate = new Date();
					this.endDate = new Date();
					this.selectStartDate(this.startDate);
					this.selectEndDate(this.endDate);
					helper.closeAlert();
				}
			)
		} catch (error) {
			helper.failAlert('ไม่สำเร็จ', error);
		}
	},
	methods: {
		compareQuota() {
			const remainQuotas = this.leaveQuotas.filter((leave) => {
				return leave.name == this.selectedLeaveType;
			});
			const quota = remainQuotas.reduce((acc, object) => {
				return acc + object.quota;
			}, 0);
			return (quota >= this.requestDays);
		},
		sendLeaveRequest() {
			if (this.requestDays <= 0) {
				helper.failAlert('ไม่สำเร็จ', 'จำนวนวันลาต้องมากกว่า 0.5 วันขึ้นไป');
			}
			else if (!this.compareQuota()) {
				helper.failAlert('ไม่สำเร็จ', 'จำนวนวันลาต้องน้อยกว่าหรือเท่ากับโควต้าคงเหลือ');
			}
			else {
				Swal.fire({
					title: "ยืนยัน?",
					html: "ส่งคำขออนุมัติการลาหรือไม่?<br/>โดยคำขอจะอยู่ในสถานะ 'ส่งแล้ว'",
					icon: "question",
					showCancelButton: true,
					confirmButtonText: "ยืนยัน",
					confirmButtonColor: "#039018",
					cancelButtonColor: '#d33',
					cancelButtonText: "ยกเลิก"
				}).then((result) => {
					if (result.isConfirmed) {
						helper.loadingAlert();
						let data = {
							leave_type: this.selectedLeaveType,
							start_date: this.selectedStartDate,
							start_date_time: this.selectedStartDateTime,
							end_date: this.selectedEndDate,
							end_date_time: this.selectedEndDateTime,
							request_days: this.requestDays,
							description: this.description,
							requester: this.userData.emp_code,
							half_day: this.isHalfDay ? this.selectedHalfDay : false
						};
						const formData = new FormData();
						const json = JSON.stringify(data);
						let fileCheck = 'withoutfile';
						formData.append("request_data", json);
						if (this.attachment) {
							formData.append("attachment", this.attachment)
							fileCheck = 'withfile'
						}
						LeaveService.sendLeaveRequest(fileCheck, formData).then(
							response => {
								helper.successAlert('ดำเนินการสำเร็จ', response, () => {
									location.reload();
								})
							},
							error => {
								helper.failAlert(undefined, error);
							}
						)
					}
				})
			}
		},
		selectFile(event) {
			this.attachment = event[0]
		},
		getStringDate(date) {
			const day = helper.zeroPad(date.getDate(), 2);
			const month = helper.zeroPad(date.getMonth() + 1, 2);
			const year = date.getFullYear();
			const stringDate = `${year}-${month}-${day}`;
			return stringDate;
		},
		selectStartDate(date) {
			const selectedDate = this.getStringDate(date);
			const selectedDateTime = selectedDate+" 00:00:00";
			if (this.isHalfDay && (this.endDate != date)) {
				this.endDate = date;
				this.selectEndDate(date)
			} 
			this.selectedStartDate = selectedDate;
			this.selectedStartDateTime = selectedDateTime;
			if (this.selectedStartDate && this.selectedEndDate) {
				this.calculateLeaveDays();
			}
		},
		selectEndDate(date) {
			const selectedDate = this.getStringDate(date);
			const selectedDateTime = selectedDate+" 00:00:00";
			this.selectedEndDate = selectedDate;
			this.selectedEndDateTime = selectedDateTime;
			if (this.selectedStartDate && this.selectedEndDate) {
				this.calculateLeaveDays();
			}
		},
		calculateLeaveDays() {
			const date1 = new Date(this.selectedStartDate);
			const date2 = new Date(this.selectedEndDate);
			const currentDate = date1;
			let count = 0;
			if (!this.isHalfDay) {
				while (currentDate <= date2) {
					const dayOfWeek = currentDate.getDay();
					const currentStringDate = this.getStringDate(currentDate);
					if (dayOfWeek !== 0 && dayOfWeek !== 6 && this.allHolidays.indexOf(currentStringDate) === -1) count++;
					currentDate.setDate(currentDate.getDate() + 1);
				}
				this.requestDays = count;
			} else {
				this.requestDays = 0.5;
			}
		},
		checkHalfday() {
			if (this.isHalfDay && this.selectedStartDate) {
				const startDate = new Date(this.selectedStartDate);
				this.endDate = startDate;
				this.selectEndDate(startDate);
			} else if (!this.isHalfDay && (this.selectedStartDate === this.selectedEndDate)) {
				this.calculateLeaveDays();
			}
		},
		dateFormatter(type) {
			const date = (type === "start") ? new Date(this.startDate) : new Date(this.endDate);
			const day = helper.zeroPad(date.getDate(), 2);
			const month = helper.zeroPad(date.getMonth() + 1, 2);
			const year = date.getFullYear();
			return `${day}/${month}/${year}`;
		}
	},
	data() {
		return {
			pageTitle: 'ลางาน',
			userData: null,
			leaveQuotas: null,
			leaveTypeOptions: null,
			selectedLeaveType: null,
			startDate: null,
			endDate: null,
			selectedStartDate: null,
			selectedEndDate: null,
			selectedStartDateTime: null,
			selectedEndDateTime: null,
			selectedHalfDay: null,
			allHolidays: [],
			description: null,
			attachment: null,
			requestDays: 0,
			isHalfDay: false,
			halfDayOptions: [
				{'value': 'morning', 'label': 'ครึ่งวันเช้า'},
				{'value': 'afternoon', 'label': 'ครึ่งวันบ่าย'}
			]
		}
	},
	computed: {
		...mapGetters(['userProfile']),
		getDisabledDates() {
			const disableDates = this.allHolidays.map(strDate => {
				const date = new Date(strDate);
				return date;
			});
			return disableDates;
		},
		startDateFormat() {
			return this.dateFormatter("start");
		},
		endDateFormat() {
			return this.dateFormatter("end");
		}
	},
}
</script>

<style scoped>
.highlight {
	background-color: #0c2f53;
	color: #ffc600;
}
</style>