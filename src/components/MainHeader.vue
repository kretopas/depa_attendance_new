<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
		<div class="container-fluid">
			<router-link to="/">
				<a class="navbar-brand">depa Attendance</a>
			</router-link>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler"
			aria-controls="navbarToggler" aria-expanded="true" aria-label="Toggle Navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse show navbar-collapse" id="navbarToggler">
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
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>
export default {
	data() {
		return {}
	},
	methods: {

	},
	computed: {

	}
}
</script>