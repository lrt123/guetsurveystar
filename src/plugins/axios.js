import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$http = axios;
Vue.prototype.$http.defaults.withCredentials = true;
Vue.prototype.$http.defaults.baseURL = "http://47.100.137.175:20000";
require("promise.prototype.finally").shim();
