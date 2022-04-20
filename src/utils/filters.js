import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatDateYM', function (value) {
  if (value) {
    return moment(String(value)).isValid ? moment(String(value)).format('YYYY年MM月') : ''
  }
})
Vue.filter('formatDateYMD', function (value) {
  if (value) {
    return moment(String(value)).isValid ? moment(String(value)).format('YYYY年MM月DD日') : ''
  }
})
Vue.filter('formatDateYMDhmsa', function (value) {
  if (value) {
    return moment(String(value)).isValid ? moment(String(value)).format('YYYY-MM-DD hh:mm:ss a') : ''
  }
})
