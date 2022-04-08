// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
//设置接口基准地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//为每一次请求挂载Authorization请求头字段
axios.interceptors.request.use(config => {
  //console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

Vue.use(ElementUI)
//Vue.use(ZkTable)
Vue.component('tree-table',ZkTable)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
