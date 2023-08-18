<template>
  <MainHeader />
  <router-view/>
</template>

<script>
import MainHeader from '@/components/MainHeader.vue';
import helper from '@/helpers/helper';
import liff from '@line/liff';

export default {
  name: 'MainApp',
  components: {
    MainHeader
  },
  methods: {
    getLineProfile() {
      liff.init({
        liffId: '1656209177-0NA1ReVK',
        withLoginOnExternalBrowser: true
      })
      .then(() => {
        liff.getProfile()
        .then((profile) => {
          this.$store.dispatch('userProfile', profile);
        }).catch(() => {
          helper.failAlert("ผิดพลาด", "ไม่สามารถดึงข้อมูลผู้ใช้จาก LINE ได้");
        })
      })
      .catch(() => {
        helper.failAlert("ผิดพลาด", "ไม่สามารถเข้าสู่ระบบผ่านบัญชี LINE ได้<br/>กรุณาตรวจสอบสิทธิ์/การอนุญาตการใช้งาน")
      })
    },
    getDefaultProfile() {
      const userProfile = {
        "userId": process.env.VUE_APP_DEFAULT_USER_ID,
        "displayName": process.env.VUE_APP_DEFAULT_DISPLAY_NAME,
      }
      this.$store.dispatch('userProfile', userProfile);
    }
  },
  mounted() {
    //this.getLineProfile();
    this.getDefaultProfile();
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

.button-clear {
  margin-bottom: 5px;
}

.false-text {
  color: red;
}

.success-text {
  color: green;
}

.warning-text {
  color: #e67e00;
}

.form-group {
  margin-left: 10px;
  margin-bottom: 10px;
}

.btn-block {
  margin-left: 10px;
}

.btn-row {
  display: inline-block;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
}

.btn-left {
  float: left;
}

.btn-right {
  float: right;
  margin: 10px;
}

.form-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

.form-label {
  text-align: left;
}

.page-title {
  margin-top: 10px;
}

</style>
