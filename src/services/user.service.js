import api from '@/services/api';

class UserService {

	/**
	 * fetch user from employee table using parameter `userId`
	 * @param {string} userId 
	 * @returns {Promise}
	 */
	getUser(userId) {
		return api.get(`/checkUser/?userId=${userId}`).then(
			response => {
				//if (response.data)
				if ('email' in response.data) {
					return response.data;
				} else {
					return undefined;
				}
			},
			() => {
				return Promise.reject('ไม่สามารถดึงข้อมูลผู้ใช้งานได้');
			}
		)
	}

	/**
	 * insert new user to employee table 
	 * @param {string} userId 
	 * @param {string} empCode 
	 * @param {string} email 
	 * @returns 
	 */
	addUser(userId, empCode, email) {
		return api.get(`/addUser/?userId=${userId}&emp_code=${empCode}&email=${email}`).then(
			response => {
				if (response.data.message == 'success') {
					return true;
				} else {
					return false;
				}
			},
			() => {
				return Promise.reject('ไม่สามารถตรวจสอบข้อมูลผู้ใช้งานได้');
			}
		)
	}

	/**
	 * in case there are duplicate user, replace new userId to existing empCode
	 * @param {string} userId 
	 * @param {string} empCode 
	 * @param {string} email 
	 * @returns 
	 */
	updateUser(userId, empCode, email) {
		return api.get(`/updateUser/?userId=${userId}&emp_code=${empCode}&email=${email}`).then(
			response => {
				if (response.data.message == 'success') {
					return true;
				} else {
					return false;
				}
			},
			() => {
				return Promise.reject('ไม่สามารถอัพเดทข้อมูลผู้ใช้งานได้');
			}
		)
	}
}

export default new UserService();