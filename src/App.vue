<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  created() {
    console.log(this.$cookies.get("token"));
    this.$setAuth(this.$cookies.get("token"));
  }
}
</script>

<style>

/* 修复弹框不适配移动端的问题 */
@media screen and (max-width: 750px) {
  .el-message-box {
    width: 60% !important;
  }
}

html {
  height: 100%;
}

body {
  margin:0;
  height: 100%;
}

#app {
  height: 100%;
}

</style>
