import Vue from 'vue'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies);
Vue.prototype.$cookies = VueCookies;
Vue.prototype.$cookies.config('30d', 'http://192.168.1.176:20000');