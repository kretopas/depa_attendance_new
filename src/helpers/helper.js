import Swal from 'sweetalert2';

class MainHelper {
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

	successAlert(title, message, callback) {
		Swal.fire({
			title: title,
			html: message,
			icon: 'success',
			confirmButtonText: 'ตกลง'
		}).then(() => {
			callback();
		});
	}

	failAlert(title, message) {
		Swal.fire({
			title: title,
			html: message,
			icon: 'error',
			confirmButtonText: 'ตกลง'
		});
	}

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