import 'element-ui/lib/theme-chalk/index.css'
import 'blob'
import ElementUI from 'element-ui'
import locale from 'element-ui/src/locale/lang/zh-TW'
import axios from 'axios'
import '@babel/polyfill'
// import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import moment from 'moment'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import commonMixin from '@/utils/commonMixin'
import '@/utils/filters'
import '@/plugins/elementui.js'

Vue.use(ElementUI, { locale })
Vue.config.lang = 'zh-tw'
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$moment = moment
Vue.mixin(commonMixin)
library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
