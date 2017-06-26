// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'
// import Weauth from './auth/vue-weauth'

Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = '/api/1.0'
Vue.axios.defaults.timeout = 20000

// Vue.use(Weauth, {axios, router, appid: 'wx1ac88143b7396b56'})

document.addEventListener('DOMContentLoaded', function () {
  if (window.FastClick) window.FastClick.attach(document.body)
}, false)

Vue.router = router
Vue.use(VueAuth, {
  auth: {
    request: function (req, token) {
      req.headers.authorization = token
      // this.options.http._setHeaders.call(this, req, {Authorization: token})
    },
    response: function (res) {
      // Get Token from response body
      // var token = this.options._getHeaders.call(this, res).Authorization
      let token = res.data.token
      return token
    }
  },
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData: { url: '/auth', method: 'POST', fetchUser: false },
  refreshData: { enabled: false }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
