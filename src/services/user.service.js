import api from '@/services/api';

class UserService {
	getUser(userId) {
		return api.get(`/checkUser/?userId=${userId}`)
	}
}

export default new UserService();