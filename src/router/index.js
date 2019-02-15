import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue' // 由webpack模板提供这么写法
import home from '@/components/home.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/login'

  }, {
    path: '/login',
    name: 'login',
    component: login
  }, {
    path: '/home',
    name: 'home',
    component: home
  }]
})
