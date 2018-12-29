const PURCHASE_API = '/api/purchase'

const HOST = process.env.SERVER_URL
// 采购库存列表
const getPurchaseList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PURCHASE_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 采购库存新增
const savePurchase = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + PURCHASE_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 采购库存详情
const purchaseDetail = (context, purchaseId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PURCHASE_API + '/' + purchaseId, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 采购库存修改
const modifyPurchase = (context, purchaseId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + PURCHASE_API + '/' + purchaseId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 库存明细列表
const getDetialsList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PURCHASE_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 库存明细新增
const saveDetails = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + PURCHASE_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 库存明细详情
const storeDetail = (context, detailsId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PURCHASE_API + '/' + detailsId, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 库存明细修改
const modifyDetails = (context, detailsId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + PURCHASE_API + '/' + detailsId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export {
  modifyPurchase,
  purchaseDetail,
  savePurchase,
  getPurchaseList,
  getDetialsList,
  saveDetails,
  storeDetail,
  modifyDetails
}
