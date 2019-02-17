import Vue from 'vue'
import App from './App'
import router from './router'
import HttpServer from '@/router/axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
// import VeeValidate from 'vee-validate'
import buildBread from '@/components/bulidBread.vue'
import '@/assets/base.css'


//全局自定义面包屑组件,在之前学过的全局组件当中，里面有template，data等等，是一组对象，前面一个是组件的名字
//到时候需要用到这个组件的时候将buildBread作为标签名，在由之前的porps传的属性进行传值，就ok了
Vue.component(buildBread.name, buildBread)

Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

//调用element插件
Vue.use(ElementUI)

// 设置 Vue.config.productionTip = false 来关闭生产模式下给出的提示
Vue.config.productionTip = false

Vue.use(HttpServer)


// const config = {
//   errorBagName: 'errorsBags', // change if property conflicts.
//   fieldsBagName: 'fieldBags',
//   delay: 0,
//   locale: 'en',
//   strict: true,
//   enableAutoClasses: false,
//   classNames: {
//     touched: 'touched', // the control has been blurred
//     untouched: 'untouched', // the control hasn't been blurred
//     valid: 'valid', // model is valid
//     invalid: 'invalid', // model is invalid
//     pristine: 'pristine', // control has not been interacted with
//     dirty: 'dirty' // control has been interacted with
//   },
//   events: 'input|blur',
//   inject: true
// }

// Vue.use(VeeValidate, config)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
