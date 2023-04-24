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
				console.log(response.data);
				return Promise.resolve('ส่งคำขอการลาสำเร็จ')
			} else {
				return Promise.reject('ไม่สามารถส่งคำขอการลาได้')
			}
		})
	}
}

export default new LeaveService();