// import jwtDecode from 'jwt-decode'
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import NotFound from '@/views/errorPage/404'
import Forbidden from '@/views/errorPage/403'

Vue.use(Router)
export default new Router({
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      component: Login,
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
