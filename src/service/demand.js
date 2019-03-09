const DEMAND_API = '/api/demand_applications'
const DEMAND_MODIFY_API = '/api/demand_modifies'
const HOST = process.env.SERVER_URL
// 需求申请列表
const getDemandList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + DEMAND_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 新增需求申请
const saveDemand = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + DEMAND_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 需求申请详情
const demandDetail = (context, demandId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + DEMAND_API + '/' + demandId, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 编辑需求申请
const editDemandDetail = (context, demandId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + DEMAND_API + '/' + demandId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 确认完成需求申请
const confirmDemand = (context, demandId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .put(HOST + DEMAND_API + '/' + demandId + '/confirm', { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 接单需求申请
const receiveDemand = (context, demandId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .put(HOST + DEMAND_API + '/' + demandId + '/receive', { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 需求修改列表
const getDemandModifyList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + DEMAND_MODIFY_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 新增需求修改
const saveDemandModify = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + DEMAND_MODIFY_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 需求修改详情
const demandModifyDetail = (context, demandModifyId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + DEMAND_MODIFY_API + '/' + demandModifyId, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 编辑需求修改
const editDemandModifyDetail = (context, demandModifyId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + DEMAND_MODIFY_API + '/' + demandModifyId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 审批需求修改
const reviewDemand = (context, demandModifyId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .put(HOST + DEMAND_MODIFY_API + '/' + demandModifyId + '/review', {
        params: params
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 反馈需求修改
const feedbackDemand = (context, demandModifyId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .put(
        HOST + DEMAND_MODIFY_API + '/' + demandModifyId + '/feedback',
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

export {
  getDemandList,
  saveDemand,
  demandDetail,
  editDemandDetail,
  confirmDemand,
  receiveDemand,
  getDemandModifyList,
  feedbackDemand,
  reviewDemand,
  editDemandModifyDetail,
  demandModifyDetail,
  saveDemandModify
}
