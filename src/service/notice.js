const NOTICE_API = '/api/user/notifications'
const READ_NOTICE_API = '/api/user/read/notifications'
const NOTICE_SRATS_API = '/api/user/notifications/stats'
const ACTIVITIES_API = '/api/user/activities'
const HOST = process.env.SERVER_URL
// 消息列表
const getNoticeList = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + NOTICE_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 已读
const readNotifications = context => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + READ_NOTICE_API)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 消息通知数
const notificationStats = context => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + NOTICE_SRATS_API)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 操作记录列表
const getActivitiesList = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + ACTIVITIES_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export {
  getNoticeList,
  getActivitiesList,
  notificationStats,
  readNotifications
}
