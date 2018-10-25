const INVOICE_API = '/api/invoice'
const HOST = process.env.SERVER_URL

const getInvoiceList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVOICE_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const saveInvoice = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + INVOICE_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const invoiceDetail = (context, invoiceId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVOICE_API + '/' + invoiceId, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const modifyInvoice = (context, invoiceId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + INVOICE_API + '/' + invoiceId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const deleteInvoice = (context, invoiceId) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .delete(HOST + INVOICE_API + '/' + invoiceId)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 审批票据
const auditingInvoice = (context, invoiceId) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + INVOICE_API + '/auditing/' + invoiceId)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 认领票据
const receiveInvoice = (context, invoiceId) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + INVOICE_API + '/receive/' + invoiceId)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export {
  getInvoiceList,
  saveInvoice,
  invoiceDetail,
  modifyInvoice,
  deleteInvoice,
  auditingInvoice,
  receiveInvoice
}
