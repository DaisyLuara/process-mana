import { Message, MessageBox } from 'element-ui'
import { Cookies } from 'service'
import app from '../main'
import axios from 'axios'
const HOST = process.env.SERVER_URL
const DOMAIN = process.env.DOMAIN
const LOGIN_URL = process.env.LOGIN_URL
const USERINFO_API = '/api/user?include=roles'
const LOGOUT_API = '/api/authorizations/current'
const USER_API = '/api/user'
export default {
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
      .then(() => {
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
    context.$cookie.delete('jwt_token', { domain: DOMAIN })
    context.$cookie.delete('user_info', { domain: DOMAIN })
    context.$cookie.delete('jwt_ttl', { domain: DOMAIN })
    context.$cookie.delete('jwt_begin_time', { domain: DOMAIN })
    localStorage.removeItem('permissions')
    context.$cookie.delete('permissions', { domain: DOMAIN })
    let setIntervalValue =
      context.$store.state.notificationCount.setIntervalValue
    clearInterval(setIntervalValue)
  },

  getToken() {
    return Cookies.get('jwt_token')
  },

  getTowerAccessToken() {
    let user_info = Cookies.get('jwt_token')
    return user_info.tower_access_token
  },

  getUserInfo() {
    // let permissions = Cookies.get('permissions')
    console.log(5)
    let permissions = localStorage.getItem('permissions')
    console.log(permissions)
    if (permissions) {
      return JSON.parse(permissions)
    }
    return {}
  },

  getPermission() {
    console.log(4)
    let permissions = this.getUserInfo()
    console.log(permissions)
    return permissions
  },

  checkPathPermission(route) {
    if (!route.meta || !route.meta.permission) {
      return true
    }
    return this.checkPermission(route.meta.permission)
  },
  refreshUserInfo(context) {
    return new Promise((resolve, reject) => {
      axios
        .get(HOST + USERINFO_API)
        .then(response => {
          console.log(2)
          let result = response.data
          localStorage.setItem(
            'permissions',
            JSON.stringify(result.permissions)
          )
          location.assign(window.location.href)
          //context.$store.commit('setCurUserInfo', result.data)
          resolve(result.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  async init() {
    await this.refreshUserInfo(app)
    // await this.checkPermission(name)
  },
  checkPermission(name) {
    console.log(1)
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
  }
}

function hasPermission(name, perms) {
  console.log(3)
  if (!perms) {
    return false
  }
  for (let i in perms) {
    if (name == perms[i]['name']) {
      console.log(3)
      return true
    }
  }
  return false
}
