import Vue from 'vue'
import auth from 'service/auth'
import app from '../main'
import Router from 'vue-router'
import { Message } from 'element-ui'
import logout from 'page/logout'
import store from 'store'
import pRouter from 'router/pRouter'
import PageNotFound from 'page/PageNotFound'
const LOGIN_URL = process.env.LOGIN_URL

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    pRouter,
    {
      path: '/logout',
      component: logout
    },
    { path: '*', component: PageNotFound }
  ]
})

// Add router hook for handling asyncData.
// Doing it after initial route is resolved so that we don't double-fetch
// the data that we already have. Using router.beforeResolve() so that all
// async components are resolved.

// router.beforeResolve((to, from, next) => {
//   const matched = router.getMatchedComponents(to)
//   const prevMatched = router.getMatchedComponents(from)
//   let diffed = false
//   const activated = matched.filter((c, i) => {
//     return diffed || (diffed = prevMatched[i] !== c)
//   })
//   const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
//   if (!asyncDataHooks.length) {
//     return next()
//   }
//   console.log(asyncDataHooks)
//   // bar.start()
//   Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
//     .then(() => {
//       // bar.finish()
//       next()
//     })
//     .catch(next)
// })

router.beforeEach((to, from, next) => {
  // 非登录白名单（非登录状态下，仍然可以访问的路由）
  let loginess = ['/login']
  if (!auth.checkLogin()) {
    let pathWhiteList = loginess.filter(pathness => {
      if (to.path == pathness) {
        return pathness
      }
    })
    if (pathWhiteList.length < 1) {
      // next({ path: '/login' })
      localStorage.removeItem('permissions')
      window.location.href = LOGIN_URL
    } else {
      next()
    }
    return
  }
  if (!localStorage.getItem('permissions')) {
    auth.init()
    return
  } else if (localStorage.getItem('permissions').data) {
    auth.clearLoginData(app)
  }
  // // // 登录黑名单（登录状态下，不可再访问的路由）
  let unlessLogout = ['/login']
  let loginBlackList = unlessLogout.filter(unlessPath => {
    if (to.path == unlessPath) {
      return unlessPath
    }
  })
  if (loginBlackList.length > 0) {
    next({ path: '/' })
    return
  }
  // 权限白名单(不受权限限制)
  // let permissioness = ['/login', '/findPassword']
  let hasPathPermission = auth.checkPathPermission(to)
  if (hasPathPermission) {
    store.commit('refreshRoute', to)
    next()
  } else {
    Message.error('您没有权限访问这个页面')
  }
})

export default router
