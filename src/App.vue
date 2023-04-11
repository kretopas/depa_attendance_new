<template>
  <MainHeader />
  <router-view/>
</template>

<script>
import MainHeader from '@/components/MainHeader.vue';

export default {
  name: 'MainApp',
  components: {
    MainHeader
  },
  data() {
    return {
    }
  },
  mounted() {
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

.form-group {
  margin-left: 10px;
  margin-bottom: 10px;
}

.btn-block {
  margin-left: 10px;
}

.btn-row {
  margin-top: 10px;
  margin-bottom: 20px;
}

.form-box {
  margin-top: 20px;
}

.form-label {
  text-align: left;
}

.page-title {
  margin-top: 10px;
}

</style>
