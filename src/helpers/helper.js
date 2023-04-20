import Swal from 'sweetalert2';

class MainHelper {
	/**
	 * check if all characters are number
	 * @param {string} value 
	 * @returns {Boolean} 
	 */
	isNumeric(value) {
		return /^-?\d+$/.test(value);
	}

	defaultCallback() {
		location.reload();
	}

	/**
	 * show loading message with sweetalert
	 * @param {string} message 
	 */
	loadingAlert(message = "กรุณารอสักครู่") {
		Swal.fire({
			title: message,
			allowOutsideClick: false
		});
		Swal.showLoading();
	}

	closeAlert() {
		Swal.close();
	}

	/**
	 * show success message with sweetalert then call callback function
	 * @param {string} title 
	 * @param {string} message 
	 * @param {Function} callback 
	 */
	successAlert(title='สำเร็จ', message, callback=this.defaultCallback) {
		Swal.fire({
			title: title,
			html: message,
			icon: 'success',
			confirmButtonText: 'ตกลง'
		}).then(() => {
			callback();
		});
	}

	/**
	 * show fail message with sweetalerts
	 * @param {string} title 
	 * @param {string} message 
	 */
	failAlert(title='ผิดพลาด', message) {
		Swal.fire({
			title: title,
			html: message,
			icon: 'error',
			confirmButtonText: 'ตกลง'
		});
	}

	/**
	 * show fail message with sweetalert then call callback function
	 * @param {string} title 
	 * @param {string} message 
	 * @param {Function} callback 
	 */
	failAlertWithCallback(title='ผิดพลาด', message, callback=this.defaultCallback) {
		Swal.fire({
			title: title,
			html: message,
			icon: 'error',
			confirmButtonText: 'ตกลง'
		}).then(() => {
			callback();
		});
	}

	/**
	 * show warning message with sweetalert
	 * @param {string} title 
	 * @param {string} message 
	 */
	warningAlert(title, message) {
		Swal.fire({
			title: title,
			html: message,
			icon: 'warning',
			confirmButtonText: 'ตกลง'
		});
	}
}

export default new MainHelper();