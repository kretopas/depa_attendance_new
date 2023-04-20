import api from '@/services/api';

class AttendanceService {
	/**
	 * insert coordinate for WFH to employee table of `userId`
	 * @param {string} userId 
	 * @param {Object} position
	 * @returns 
	 */
	registerCoordinate(userId, position) {
		return api.get(`registerCoordinate/?userId=${userId}&latitude=${position.lat}&longitude=${position.lng}`).then(
			response => {
				console.log(response);
			},
			() => {
				return Promise.reject('ไม่สามารถลงทะเบียนพิกัดได้');
			}
		)
	}

	deg2rad(deg) {
		return deg * (Math.PI/180)
	}

	/**
	 * get two different coordinates then calculate distance between them in the meter unit
	 * @param {number} lat1 
	 * @param {number} lat2 
	 * @param {number} lng1 
	 * @param {number} lng2 
	 * @returns {number}
	 */
	distanceCalculator(lat1, lng1, lat2, lng2) {
		var R = 6371; // Radius of the earth in km
		var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
		var dLon = this.deg2rad(lng2-lng1); 
		var a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
			Math.sin(dLon/2) * Math.sin(dLon/2)
			; 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = (R * c) * 1000; // Distance in m
		return d;
	}

	/**
	 * insert new check-in/out record to the attendance table
	 * @param {string} userId 
	 * @param {Object} position
	 * @param {Boolean} isCheckedIn 
	 * @returns 
	 */
	insertTimeRecord(userId, position, isCheckedIn) {
		const userChecked = isCheckedIn ? 1 : 0;
		return api.get(`/checking/?userId=${userId}&latitude=${position.lat}&longitude=${position.lng}&checked=${userChecked}`).then(
			() => {
				return true;
			},
			() => {
				return Promise.reject('ไม่สามารถลงเวลาได้<br/>กรุณาติดต่อฝ่ายทรัพยากรองค์กรและบุคคล');
			}
		)
	}

	/**
	 * fetch all office locations and get current position
	 * then check if coordinate is in range of one of the office location
	 * @param {Object} pCurrent 
	 * @returns 
	 */
	async checkLocationOffice(pCurrent) {
		var currentDistance = Number.MAX_VALUE;
		return await this.getAllLocation().then(
			(response) => {
				response.forEach((result) => {
					var distance = this.distanceCalculator(result.latitude, result.longitude, pCurrent.lat, pCurrent.lng);
					if (distance < currentDistance) {
						currentDistance = distance;
					}
				})
				return currentDistance;
			},
			(error) => {
				console.log(error);
				return Promise.reject('ไม่สามารถตรวจสอบระยะทางได้<br/>กรุณาติดต่อฝ่ายทรัพยากรองค์กรและบุคคล');
			}
		)
	}

	/**
	 * get current position and WFH position then check if coordinate is in range of registered WFH location
	 * @param {Object} pCurrent 
	 * @param {Object} pWFH
	 * @returns
	 */
	checkLocationWFH(pCurrent, pWFH) {
		const distance = this.distanceCalculator(pCurrent.lat, pCurrent.lng, pWFH.lat, pWFH.lng);
		return distance;
	}

	/**
	 * Get all registered location for attendance
	 * @returns 
	 */
	getAllLocation() {
		return api.get(`/getLocation/`).then(
			(response) => {
				return response.data
			},
			(error) => {
				console.log(error);
				return Promise.reject('ไม่สามารถดึงข้อมูลพิกัดสำหรับลงเวลาทั้งหมดได้');
			}
		)
	}
}

export default new AttendanceService();