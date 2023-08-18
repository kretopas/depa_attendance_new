<template>
	<h1 class="page-title"><span>{{  pageTitle }}</span></h1>
	<div class="container" v-if="userProfile && permission">
		<div>
			ผู้ใช้งาน: <strong>{{ userProfile.displayName }} <span v-if="userData">({{ userData.emp_code }})</span> </strong>
		</div>
		<div v-if="leaveRequests" align="left" class="form-box">
			<div v-for="request in leaveRequests" v-bind:key="request">
				<div :class="'card '+ this.leaveTypes[request.request_type_id[0]].color + ' mb-6'">
					<div class="card-header">
						<span>ผู้ขออนุมัติ: <b>{{ request.requester_id[1] }} ({{ request.request_type_id[1] }})</b></span>
					</div>
					<div class="card-body">
						<p class="card-text">ช่วงเวลา: 
							<strong>{{ request.request_date_from }}</strong>
							ถึง
							<strong>{{ request.request_date_to }}</strong>
							<span v-if="request.half_day_selection">
								({{ this.halfdaySelected[request.half_day_selection] }})
							</span>
						</p>
						<p class="card-text">ระยะเวลา: <strong>{{ request.request_days }}</strong> วัน</p>
						<p class="card-text">รายละเอียด: {{ request.request_desc }}</p>
						<div class="btn-right">
							<button
							type="button" class="btn btn-danger btn-block"
							@click="rejectRequest(request.id)"
							>
								ปฏิเสธ
							</button>
							<button
							type="button" class="btn btn-success btn-block"
							@click="approveRequest(request.id)"
							>
								อนุมัติ
							</button>
						</div>
						
					</div>
				</div>
			</div>
		</div>
		<div align="center" v-else-if="leaveRequests == false">
			<p class="false-text">
				<b>ยังไม่มีคำขออนุมัติการลาในขณะนี้</b>
			</p>
		</div>
	</div>
	<div align="center" v-else-if="permission == false">
		<p class="false-text">
			<b>ท่านไม่มีสิทธิ์ในการอนุมัติการลางาน</b>
		</p>
	</div>
</template>

<script>
//import helper from '@/helpers/helper';
import Swal from 'sweetalert2';
import helper from '@/helpers/helper';
import { mapGetters } from 'vuex';
import UserService from '@/services/user.service';
import LeaveService from '@/services/leave.service';

export default {
	name: 'LeaveApproveListPage',
	async mounted() {
		try {
			helper.loadingAlert();
			UserService.getUser(this.userProfile.userId).then(
				(user) => {
					this.userData = user;
					const emp_code = this.userData.emp_code;
					LeaveService.getLeavePermission(emp_code).then(
						(permission) => {
							this.permission = permission;
							if (permission) {
								LeaveService.getLeaveApprovalList(emp_code).then(
									(list) => {
										this.leaveRequests = list;
									}
								)
							}
						}
					)
					helper.closeAlert();
				}
			)
		} catch (error) {
			helper.failAlert('ไม่สำเร็จ', error)
		}
	},
	methods: {
		approveRequest(requestID) {
			console.log(`approve ${requestID}`);
			Swal.fire({
				title: "ยืนยัน?",
				html: "อนุมัติการลาหรือไม่?",
				icon: "question",
				showCancelButton: true,
				confirmButtonText: "ยืนยัน",
				confirmButtonColor: "#039018",
				cancelButtonColor: '#d33',
				cancelButtonText: "ยกเลิก"
			}).then((result) => {
				if (result.isConfirmed) {
					helper.loadingAlert();
					LeaveService.approveLeaveRequest(requestID).then()
					helper.closeAlert();
				}
			})
		},
		async rejectRequest(requestID) {
			console.log(`reject ${requestID}`);
			const {value: remark} = await Swal.fire({
				title: "ปฏิเสธ?",
				input: 'text',
				inputLabel: 'กรอกเหตุผลที่ปฏิเสธการลานี้',
				inputPlaceholder: 'เหตุผล',
				showCancelButton: true,
				confirmButtonColor: "#039018",
				confirmButtonText: "ยืนยัน",
				cancelButtonColor: '#d33',
				cancelButtonText: "ยกเลิก",
				inputValidator: (value) => {
					if (!value) {
						return "กรุณากรอกเหตุผล"
					}
				}
			});

			if (remark) {
				helper.loadingAlert();
				LeaveService.rejectLeaveRequest(requestID, remark).then(
					() => {
						console.log("PASS");
						helper.closeAlert();
					},
					() => {
						console.log("NOT PASS");
						helper.closeAlert();
					}
				);
			}
		}
	},
	data() {
		return {
			pageTitle: 'อนุมัติการลางาน',
			userData: null,
			permission: null,
			leaveRequests: null,
			halfdaySelected: {
				morning: 'ครึ่งวันเช้า',
				afternoon: 'ครึ่งวันบ่าย',
			},
			leaveTypes: {
				1: {
					name: 'ลาป่วย',
					color: 'border-danger'
				},
				2: {
					name: 'ลากิจส่วนตัว',
					color: 'border-warning'
				},
				3: {
					name: 'ลาพักผ่อน',
					color: 'border-info'
				},
				4: {
					name: 'ปฏิบัติงานนอกสถานที่',
					color: 'border-success'
				},
				5: {
					name: 'ไม่ได้ลงเวลาปฏิบัติงาน',
					color: 'border-dark'
				},
				6: {
					name: 'อบรม/สัมมนา',
					color: 'border-primary'
				}
			}
		}
	},
	computed: {
		...mapGetters(['userProfile']),
	}
}
</script>

<style scoped>
.top-margin {
	margin-top: 15px;
}

.card {
	margin: 10px 15px 0px;
}
</style>