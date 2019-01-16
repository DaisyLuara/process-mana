const AUDITING_COUNT_API = '/api/auditing_count'
const HOST = process.env.SERVER_URL

// 流程中消息提醒。一级菜单上的展示的小红点
const getAuditingCount = context => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + AUDITING_COUNT_API)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export { getAuditingCount }
