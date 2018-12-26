const PURCHASE_API = '/api/purchase'

const HOST = process.env.SERVER_URL

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

export { modifyPurchase, purchaseDetail, savePurchase, getPurchaseList }
