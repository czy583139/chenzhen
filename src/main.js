import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import VeeValidate from 'vee-validate'

import '@/assets/base.css'

Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.use(ElementUI)
const config = {
  errorBagName: 'errorsBags', // change if property conflicts.
  fieldsBagName: 'fieldBags',
  delay: 0,
  locale: 'en',
  strict: true,
  enableAutoClasses: false,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  },
  events: 'input|blur',
  inject: true
}

Vue.use(VeeValidate, config)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
