import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue' // 由webpack模板提供这么写法
import home from '@/components/home.vue'
import users from '@/components/users.vue'
import rights from '@/components/rights.vue'

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
    redirect: '/users',
    component: home,
    children: [{
      path: '/users',
      name: 'users',
      component: users
    }, {
      path: '/rights',
      name: 'rights',
      component: rights
    }]
  }]
})
