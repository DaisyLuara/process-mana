import { Message, MessageBox } from 'element-ui'
import { Cookies } from 'service'
const HOST = process.env.SERVER_URL
const DOMAIN = process.env.DOMAIN
const LOGIN_URL = process.env.LOGIN_URL
const LOGIN_API = '/api/authorizations'
const LOGOUT_API = '/api/authorizations/current'
const USERINFO_API = '/api/user?include=permissions,roles'
const IMAGE_CAPTCHA = '/api/captchas'
const USER_API = '/api/user'
const SMS_CAPTCHA = '/api/verificationCodes'
const TOWER_OUTH_TOKEN = '/api/oauth/token?include=permissions,roles'
export default {
  // login(context, creds, redirect) {
  //   context.setting.submiting = true
  //   context.$http
  //     .post(HOST + LOGIN_API, creds)
  //     .then(response => {
  //       //  将token与权限存储到cookie和localstorage中,取的时候从localstorage中取
  //       let loginResult = response.data
  //       this.setToken(context, loginResult)
  //       context.$message({
  //         message: '登录成功!',
  //         type: 'success'
  //       })
  //       context.setting.submiting = false
  //       this.refreshUserInfo(context).then(res => {
  //         if (localStorage.getItem('permissions').indexOf('setting') > -1) {
  //           context.$router.push({
  //             path: '/'
  //           })
  //         } else {
  //           context.$router.push({
  //             path: redirect ? redirect : '/'
  //           })
  //         }
  //       })
  //     })
  //     .catch(err => {
  //       context.setting.submiting = false
  //     })
  // },
  checkFacility() {
    if (
      /AppleWebKit.*Mobile/i.test(navigator.userAgent) ||
      /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(
        navigator.userAgent
      )
    ) {
      if (window.location.href.indexOf('?mobile') < 0) {
        if (
          /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
        ) {
          return true
        } else {
          return false
        }
      }
    }
  },
  // 根据本地token来检测用户的登录状态
  checkLogin(context) {
    if (this.checkTokenExpired(context)) {
      return false
    } else {
      return true
    }
  },

  logout(context) {
    context.$http
      .delete(HOST + LOGOUT_API)
      .then(data => {
        this.clearLoginData(context)
        let setIntervalValue =
          context.$store.state.notificationCount.setIntervalValue
        clearInterval(setIntervalValue)
        window.location.href = LOGIN_URL
      })
      .catch(err => {
        console.log(err)
      })
  },

  // 清楚一切登录相关数据
  clearLoginData(context) {
    Cookies.removeItem('jwt_token', '', DOMAIN)
    Cookies.removeItem('user_info', '', DOMAIN)
    Cookies.removeItem('jwt_ttl', '', DOMAIN)
    Cookies.removeItem('jwt_begin_time', '', DOMAIN)
    Cookies.removeItem('permissions', '', DOMAIN)
    let setIntervalValue =
      context.$store.state.notificationCount.setIntervalValue
    clearInterval(setIntervalValue)
  },

  // refreshUserInfo(context) {
  //   return new Promise((resolve, reject) => {
  //     context.$http
  //       .get(HOST + USERINFO_API)
  //       .then(response => {
  //         let result = response.data
  //         Cookies.removeItem('permissions', '', DOMAIN)
  //         Cookies.removeItem('user_info', '', DOMAIN)
  //         Cookies.set(
  //           'permissions',
  //           JSON.stringify(result.permissions),
  //           '',
  //           '',
  //           DOMAIN
  //         )
  //         Cookies.set('user_info', JSON.stringify(result), '', '', DOMAIN)
  //         //context.$store.commit('setCurUserInfo', result.data)
  //         resolve(result.data)
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },

  getToken() {
    return Cookies.get('jwt_token')
  },

  getTowerAccessToken() {
    let user_info = Cookies.get('jwt_token')
    return user_info.tower_access_token
  },

  getUserInfo() {
    let permissions = Cookies.get('permissions')
    if (permissions) {
      return JSON.parse(permissions)
    }
    return {}
  },

  getPermission() {
    let permissions = this.getUserInfo()
    return permissions
  },

  checkPathPermission(route) {
    if (!route.meta || !route.meta.permission) {
      return true
    }
    return this.checkPermission(route.meta.permission)
  },

  checkPermission(name) {
    return hasPermission(name, this.getPermission())
  },

  // 获取token的时效，分钟为单位
  getTokenLifeTime() {
    return Cookies.get('jwt_ttl')
  },

  // 获取token生成的时间
  getTokenBeginTime() {
    return Cookies.get('jwt_begin_time')
  },

  setToken(context, tokenObj) {
    let tokenBeginTime = new Date().getTime()
    Cookies.set('jwt_token', tokenObj.access_token, '', '', DOMAIN)
    Cookies.set('jwt_ttl', tokenObj.expires_in, '', '', DOMAIN)
    Cookies.set('jwt_begin_time', tokenBeginTime, '', '', DOMAIN)
  },

  // 检测token是否过期, 过期返回true，没有过期返回false
  checkTokenExpired() {
    let nowTime = new Date(),
      localToken = this.getToken(),
      tokenBeginTime = this.getTokenBeginTime(),
      tokenLifeTime = this.getTokenLifeTime(),
      differTime = nowTime - tokenBeginTime
    if (!localToken || !tokenBeginTime || !tokenLifeTime) {
      return true
    }

    let tokenlatestLifeTime = Math.floor(differTime / (60 * 1000))
    if (tokenlatestLifeTime >= tokenLifeTime) {
      return true
    }

    return false
  },

  modifyUser(context, args) {
    return new Promise((resolve, reject) => {
      context.$http
        .patch(HOST + USER_API, args)
        .then(result => {
          resolve(result.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  refreshTowerOuthToken(context) {
    return new Promise((resolve, reject) => {
      context.$http
        .post(HOST + TOWER_OUTH_TOKEN)
        .then(result => {
          resolve(result.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // 获取图形验证码
  getImageCaptcha(context, args) {
    let promise = new Promise((resolve, reject) => {
      context.$http
        .post(HOST + IMAGE_CAPTCHA, args)
        .then(result => {
          resolve(result.data)
        })
        .catch(error => {
          reject(error)
        })
    })
    return promise
  },
  sendSmsCaptcha(context, args) {
    let promise = new Promise((resolve, reject) => {
      context.$http
        .post(HOST + SMS_CAPTCHA, args)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
    return promise
  }
}

function hasPermission(name, perms) {
  if (!perms) {
    return false
  }
  for (let i in perms.data) {
    if (name == perms.data[i]['name']) {
      return true
    }
  }
  return false
}
