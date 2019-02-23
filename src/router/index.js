import Vue from 'vue'
import VueRouter from 'vue-router'

const login = () => import('@/components/login.vue') // 由webpack模板提供这么写法
const home = () => import('@/components/home.vue')
const users = () => import('@/components/users.vue')
const rights = () => import('@/components/rights.vue')
const roles = () => import('@/components/roles.vue')
const goods = () => import('@/components/goodslist.vue')
const goodsadd = () => import('@/components/goodsadd.vue')
const goodsParmars = () => import('@/components/goodsParmars.vue')
const goodsCate = () => import('@/components/goodscate.vue')
const order = () => import('@/components/order.vue')
const list = () => import('@/components/list.vue')


import {
  Message
} from 'element-ui';


Vue.use(VueRouter)

const router = new VueRouter({
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
    }, {
      path: '/roles',
      name: 'roles',
      component: roles
    }, {
      path: '/goods',
      name: 'goods',
      component: goods
    }, {
      path: '/goodsadd',
      name: 'goodsadd',
      component: goodsadd
    }, {
      path: '/params',
      name: "params",
      component: goodsParmars
    }, {
      path: '/categories',
      name: "goodsCate",
      component: goodsCate
    }, {
      path: '/orders',
      name: "order",
      component: order
    }, {
      path: '/reports',
      name: "reports",
      component: list
    }]
  }]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    const token = localStorage.getItem("token");
    if (!token) {
      Message.warning("请先登录")
      router.push({
        name: 'login'
      })
    } else {
      next()
    }
  }


})


export default router
