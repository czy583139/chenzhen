import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue' // 由webpack模板提供这么写法

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'home'

  }, {
    path: '/login',
    name: 'login',
    component: login
  }]
})
