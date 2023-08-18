import api from '@/services/api.leave';

class LeaveService {
	async getLeaveQuota(empCode) {
		return api.get(`/quota/leave/${empCode}`).then(
			response => {
				return response.data.data;
			},
			() => {
				return Promise.reject('ไม่สามารถตรวจสอบข้อมูลผู้ใช้งานได้')
			}
		);
	}

	getHolidays() {
		return api.get(`/holidays`).then(
			response => {
				return response.data.data
			},
			() => {
				return [];
			}
		)
	}

	sendLeaveRequest(fileCheck, formData) {
		return api.post(
			`/leave/request/${fileCheck}`,
			formData,
			{ "Content-Type": "multipart/form-data" }
		).then(response => {
			if (response.data != false) {
				return Promise.resolve('ส่งคำขอการลาสำเร็จ')
			} else {
				return Promise.reject('ไม่สามารถส่งคำขอการลาได้')
			}
		})
	}

	getLeavePermission(emp_code) {
		return api.post(
			`/leave/permission`,
			{
				emp_code: emp_code
			}
		).then(response => {
			if (response.data != false) {
				return response.data.data;
			} else {
				return Promise.reject('ไม่สามารถตรวจสอบสิทธิ์การใช้งานได้');
			}
		})
	}
	
	getLeaveApprovalList(emp_code) {
		return api.get(
			`/leave/list/approve/${emp_code}`
		).then(response => {
			if (response.data != false) {
				return response.data.data;
			} else {
				return Promise.reject('ไม่สามารถดึงข้อมูลการขออนุมัติการลาได้')
			}
		})
	}

	approveLeaveRequest(requestID) {
		console.log(requestID);
	}

	rejectLeaveRequest(requestID, remark) {
		console.log(requestID);
		console.log(remark);
		return Promise.resolve("TEST");
	}
}

export default new LeaveService();