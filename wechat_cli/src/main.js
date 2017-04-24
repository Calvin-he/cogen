// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// import { Header, InfiniteScroll, Cell } from 'mint-ui'
import MintUI from 'mint-ui'

document.addEventListener('DOMContentLoaded', function() {
  if (window.FastClick) window.FastClick.attach(document.body)
}, false)

Vue.prototype.$http = axios.create({
  baseURL: '/cogen/api/v1.0/',
  timeout: 1000,
  headers: {Authorization: 'Basic YXBpOnBhc3N3b3Jk'}
})

Vue.use(MintUI)
// Vue.component(Cell.name, Cell)
// Vue.component(Header.name, Header)
// Vue.component(InfiniteScroll.name, InfiniteScroll)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
