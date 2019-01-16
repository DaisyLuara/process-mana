const PAYMENT_API = '/api/payment'
const PAYMENT_PAYEE_API = '/api/payment_payee'
const PAYMENT_HISTORY_API = '/api/payment_history'
const PAYMENT_REJECT_API = '/api/payment/reject'

const HOST = process.env.SERVER_URL
// 付款列表
const getPaymentList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PAYMENT_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 保存付款
const savePayment = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + PAYMENT_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 付款详情
const paymentDetail = (context, paymentId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PAYMENT_API + '/' + paymentId, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 修改付款
const modifyPayment = (context, paymentId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + PAYMENT_API + '/' + paymentId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 删除付款
const deletePayment = (context, paymentId) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .delete(HOST + PAYMENT_API + '/' + paymentId)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 审批付款
const auditingPayment = (context, paymentId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + PAYMENT_API + '/auditing/' + paymentId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 认领票据
const receivePayment = (context, paymentId) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + PAYMENT_API + '/receive/' + paymentId)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 收款人列表
const getPayeeList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PAYMENT_PAYEE_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 保存收款人
const savePayee = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + PAYMENT_PAYEE_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 收款人详情
const payeeDetail = (context, payeeId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PAYMENT_PAYEE_API + '/' + payeeId, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 修改收款人
const modifyPayee = (context, payeeId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + PAYMENT_PAYEE_API + '/' + payeeId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 收款人历史记录
const paymentHistory = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PAYMENT_HISTORY_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 驳回
const paymentReject = (context, paymentId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + PAYMENT_REJECT_API + '/' + paymentId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export {
  getPaymentList,
  savePayment,
  paymentDetail,
  modifyPayment,
  deletePayment,
  auditingPayment,
  receivePayment,
  getPayeeList,
  savePayee,
  payeeDetail,
  modifyPayee,
  paymentHistory,
  paymentReject
}
