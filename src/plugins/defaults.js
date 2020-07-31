import Vue from 'vue'
/* 挂载一些默认方法 */

Vue.prototype.$setAuth = function(token) {
    this.$http.defaults.headers.common['Authorization'] = token;
};

Vue.prototype.$logout = function() {
    window.localStorage.clear();
    this.$cookies.remove('token');
    this.$http.get('/user/logout');
    this.$router.push({ path: '/login' });
}