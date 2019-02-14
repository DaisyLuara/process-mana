const COST_API = '/api/contract_cost'
const COST_CONFIRM_API = '/api/cost_content'
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

// 编辑明细成本
const editCostDetail = (context, costParentId, costChildId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(
        HOST + COST_API + '/' + costParentId + '/cost_content/' + costChildId,
        params
      )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 删除明细成本
const deleteCost = (context, costParentId, costChildId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .delete(
        HOST + COST_API + '/' + costParentId + '/cost_content/' + costChildId,
        { params: params }
      )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 明细成本确认
const confirmCost = (context, costChildId) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + COST_CONFIRM_API + '/' + costChildId + '/confirm')
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 明细成本新增
const addCostDetail = (context, costParentId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + COST_API + '/' + costParentId + '/cost_content', params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export {
  getCostList,
  saveCost,
  costDetail,
  editCostDetail,
  deleteCost,
  confirmCost,
  addCostDetail
}
