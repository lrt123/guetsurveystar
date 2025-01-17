import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import './plugins/axios.js'
import './plugins/cookies.js'
import './plugins/defaults.js'
import router from './router'

Vue.config.productionTip = false;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
