<template>
	<h1 class="page-title">{{ pageTitle }}</h1>
	<div class="container-fluid" v-if="mapChecked && userProfile">
		<!--{{ userProfile }}-->
		<div class="btn-row">
			<button type="button" class="btn btn-success btn-block" v-if="!checkedIn">
				<font-awesome-icon :icon="['fas', 'clock']"/> ลงเวลาเข้า
			</button>
			<button type="button" class="btn btn-danger btn-block" v-else>
				<font-awesome-icon :icon="['fas', 'clock-rotate-left']"/> ลงเวลาออก
			</button>
		</div>
		<GMapMap
		class="map"
		map-type-id="terrain"
		:center="positionCurrent"
		:zoom="16"
		:options="mapOptions"
		>
			<GMapMarker
			:position="positionCurrent"
			:clickable="false"
			:draggable="false"
			/>
			<GMapCircle
			:radius="requiresDistance"
			:center="{lat: latitudeOffice, lng: longitudeOffice}"
			:options="circleOptions"
			/>
			<GmapCircle
			:radius="requiresDistance"
			:center="{lat: latitudeWFH, lng: longitudeWFH}"
			:options="circleOptions"
			v-if="isWFH"
			/>
		</GMapMap>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import helper from '@/helpers/helper';
import getCurrentLocationWithTimeout, { TimeoutError } from 'get-location-with-timeout'
import UserService from '@/services/user.service';

export default {
	name: 'AttendancePage',
	async mounted() {
		try {
			helper.loadingAlert("กำลังตรวจสอบตำแหน่งปัจจุบัน");

			const { coords } = await getCurrentLocationWithTimeout()
			this.latitudeCurrent = coords.latitude;
			this.longitudeCurrent = coords.longitude;
			this.positionCurrent = { lat: this.latitudeCurrent, lng: this.longitudeCurrent };
			this.mapChecked = true;

			UserService.getUser(this.userProfile.userId).then(
				response => {
					console.log(response);
				}
			)

			helper.closeAlert();
		} catch (error) {
			if (error instanceof TimeoutError) {
				helper.failAlert("ไม่สำเร็จ", "Connection Timed Out.")
			} else {
				helper.failAlert("ไม่สำเร็จ", error)
			}
		}
	},
	data() {
		return {
			pageTitle: 'ลงเวลาปฏิบัติงาน',
			email: "",
			isHidden: true,
			isEmail: false,
			isWFH: false,
			checkedIn: false,
			mapChecked: false,
			latitudeCurrent: 0,
			longitudeCurrent: 0,
			positionCurrent: {lat: 0, lng: 0},
			latitudeOffice: parseFloat(process.env.VUE_APP_LATITUDE_OFFICE),
			longitudeOffice: parseFloat(process.env.VUE_APP_LONGITUDE_OFFICE),
			latitudeWFH: parseFloat(process.env.VUE_APP_LATITUDE_WFH),
			longitudeWFH: parseFloat(process.env.VUE_APP_LONGITUDE_WFH),
			distanceOffice: parseFloat(process.env.VUE_APP_DISTANCE_OFFICE),
			distanceWFH: parseFloat(process.env.VUE_APP_DISTANCE_WFH),
			distance: parseFloat(process.env.VUE_APP_DISTANCE),
			requiresDistance: 300,
			startCheckIn: process.env.VUE_APP_START_CHECKIN_TIME,
			startCheckOut: process.env.VUE_APP_START_CHECKOUT_TIME,
			endCheckIn: process.env.VUE_APP_END_CHECKIN_TIME,
			endCheckOut: process.env.VUE_APP_END_CHECKOUT_TIME,
			apiKey: process.env.VUE_APP_GOOGLE_MAP_API_KEY,
			mapOptions: {
				zoomControl: false,
				mapTypeControl: false,
				gestureHandling: 'none',
				scaleControl: false,
				streetViewControl: false,
				rotateControl: false,
				fullscreenControl: false,
				disableDefaultUi: true,
				clickable: false,
				clickableIcons: false
			},
			circleOptions: {
				strokeColor: "#468284",
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: "#ADD8E6",
				fillOpacity: 0.35
			}
		}
	},
	computed: {
		...mapGetters(['userProfile'])
	}
}
</script>

<style scoped>
.map {
	position: relative;
	width: 100%;
	height: 300px;
	left: 50%;
	transform: translateX(-50%);
}
</style>