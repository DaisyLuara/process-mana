const AUDITING_COUNT_API = '/api/auditing_count'
const HOST = process.env.SERVER_URL

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
