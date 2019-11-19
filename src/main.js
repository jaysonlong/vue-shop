import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

// 全局样式表
import './assets/css/index.css'
// 阿里巴巴图标库
import './assets/fonts/iconfont.css'

// 树型表格插件
Vue.use(ZkTable)

// axios请求处理
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 为每个请求加上Authorization请求头
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
