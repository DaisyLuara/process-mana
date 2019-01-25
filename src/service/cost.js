const COST_API = '/api/cost'
const HOST = process.env.SERVER_URL
// 成本列表
const getCostList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + COST_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 新增成本
const saveCost = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + COST_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 成本详情
const costDetail = (context, costId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + COST_API + '/' + costId, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 编辑成本
const editCost = (context, costId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + COST_API + '/' + costId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export { getCostList, saveCost, costDetail, editCost }
