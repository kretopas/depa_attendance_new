<template>
	<h1 class="page-title"><span>{{ pageTitle }}</span></h1>
	<h6 class="false-text">*แสดงประวัติการลงเวลา 30 ครั้งล่าสุด</h6>
	<div class="container" v-if="userProfile">
		<div class="btn-row">
			<router-link to="/">
				<button type="button" class="btn btn-outline-primary btn-left">
					<font-awesome-icon :icon="['fas', 'fa-chevron-left']" /> Back
				</button>
			</router-link>
		</div>
		<div class="form-box">
			<table width="80%" class="table table-bordered table-hover" v-if="historyLists">
				<thead class="table-dark">
					<tr>
						<th scope="col">วัน/เวลา</th>
						<th scope="col">ประเภท</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(row, index) in historyLists" :key="index">
						<td>{{ row.datetime }}</td>
						<td v-if="row.late === true">
							<span class="warning-text">
								<strong>ลงเวลาเข้า (เลท)</strong>
							</span>
						</td>
						<td v-else-if="row.attendance_type == 'check-in'">
							<span class="success-text">
								<strong>ลงเวลาเข้า</strong>
							</span>
						</td>
						<td v-else>
							<span class="false-text">
								<strong>ลงเวลาออก</strong>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import helper from '@/helpers/helper';
import UserService from '@/services/user.service';

export default {
	name: 'HistoryPage',
	async mounted() {
		UserService.getLastCheckedin(this.userProfile.userId).then(
			(data) => {
				for (let i = 0; i < data.length; i++) {
					const checkType = data[i].attendance_type;
					const checkTime = new Date(data[i].datetime).toLocaleTimeString('th-TH');
					if (checkTime >= "09:01:00" && checkType == 'check-in') {
						data[i].late = true;
					} else {
						data[i].late = false;
					}
				}
				this.historyLists = data;
			},
			(error) => {
				helper.failAlert(error);
			}
		)
	},
	data() {
		return {
			pageTitle: 'ประวัติการลงเวลาปฏิบัติงาน',
			historyLists: null
		}
	},
	computed: {
		...mapGetters(['userProfile'])
	}
}
</script>