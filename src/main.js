import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// ? import Axios for Vue
import VueAxios from 'vue-axios';
import axios from 'axios';
// ? import VueGoogleMap
import VueGoogleMaps from '@fawmi/vue-google-maps';
// ? import BootStrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
// ? import the fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClock, faClockRotateLeft} from '@fortawesome/free-solid-svg-icons';

library.add(faClock);
library.add(faClockRotateLeft);

const app = createApp(App);

app.use(store);
app.use(router);
app.use(VueAxios, axios);
app.use(VueGoogleMaps, {
	load: {
		key: process.env.VUE_APP_GOOGLE_MAP_API_KEY,
		region: 'TH',
		language: 'th',
	},
})
app.component('font-awesome-icon', FontAwesomeIcon)
app.provide('axios', app.config.globalProperties.axios);
app.mount("#app")