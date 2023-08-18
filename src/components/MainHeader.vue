<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-depa">
		<div class="container-fluid">
			<router-link to="/">
				<img src="@/assets/depa_logo-nobg.png" width="30" height="30" class="d-inline-block align-top" alt="depa logo"> 
				<a class="navbar-brand">depa Attendance</a>
			</router-link>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler"
			aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle Navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarToggler">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<router-link to="/">
							<a class="nav-link">ลงเวลา</a>
						</router-link>
					</li>
					<li class="nav-item">
						<router-link to="/history">
							<a class="nav-link">ประวัติการลงเวลา</a>
						</router-link>
					</li>
					<li class="nav-item">
						<router-link to="/leave">
							<a class="nav-link">ลางาน</a>
						</router-link>
					</li>
					<!--<li class="nav-item">
						<router-link to="/leave/approve">
							<a class="nav-link">อนุมัติการลางาน</a>
						</router-link>
					</li>-->
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {}
	},
	methods: {

	},
	computed: {
		...mapGetters(['userProfile'])
	}
}
</script>

<style scoped>
.bg-depa {
	background-color: #0c2f53;
}

a {
	color: whitesmoke;
	text-decoration: none;
}

a.nav-link:hover {
	color: #ffc600;
}
</style>