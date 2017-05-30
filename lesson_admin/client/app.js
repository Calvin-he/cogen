import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'
import NProgress from 'vue-nprogress'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters'
import { TOGGLE_SIDEBAR } from 'vuex-store/mutation-types'
import vSelect from 'vue-select'

Vue.router = router
Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = '/api/1.0'
Vue.axios.defaults.timeout = 20000

Vue.use(VueAuth, {
  auth: {
    request: function (req, token) {
      req.headers.authorization = token
      // this.options.http._setHeaders.call(this, req, {Authorization: token})
    },
    response: function (res) {
      // Get Token from response body
      // var token = this.options._getHeaders.call(this, res).Authorization
      let token = res.headers.authorization
      return token
    }
  },
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData: { url: '/login', fetchUser: false },
  refreshData: { enabled: false }
})

Vue.use(NProgress)

Vue.component('v-select', vSelect)
// Enable devtools
Vue.config.devtools = true

sync(store, router)

const nprogress = new NProgress({ parent: '.nprogress-container' })

const { state } = store

router.beforeEach((route, redirect, next) => {
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(TOGGLE_SIDEBAR, false)
  }
  next()
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const app = new Vue({
  router,
  store,
  nprogress,
  ...App
})

export { app, router, store }
