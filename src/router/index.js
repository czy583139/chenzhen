import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue' // 由webpack模板提供这么写法
import home from '@/components/home.vue'
import users from '@/components/users.vue'
import rights from '@/components/rights.vue'
import roles from '@/components/roles.vue'
import goods from '@/components/goodslist.vue'
import goodsadd from '@/components/goodsadd.vue'
import {
  Message
} from 'element-ui';


Vue.use(Router)

const router = new Router({
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
