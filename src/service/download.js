const HOST = process.env.SERVER_URL

// 合同管理
const getExportDownload = (context, url, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + url, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export { getExportDownload }
