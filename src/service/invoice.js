const INVOICE_API = '/api/invoice'
const INVOICE_COMPANY_API = '/api/invoice_company'
const INVOICE_HISTORY_API = '/api/invoice_history'
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

// 确认收款
const receiptInvoice = (context, invoiceId) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + INVOICE_API + '/receipt/' + invoiceId)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const getInvoiceCompanyList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVOICE_COMPANY_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const saveInvoiceCompany = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + INVOICE_COMPANY_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const invoiceCompanyDetail = (context, invoiceCompanyId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVOICE_COMPANY_API + '/' + invoiceCompanyId, {
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

const modifyInvoiceCompany = (context, invoiceCompanyId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + INVOICE_COMPANY_API + '/' + invoiceCompanyId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const getReceiptList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVOICE_COMPANY_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const saveReceipt = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + INVOICE_COMPANY_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const ReceiptDetail = (context, receiptId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVOICE_COMPANY_API + '/' + receiptId, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const modifyReceipt = (context, receiptId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + INVOICE_COMPANY_API + '/' + receiptId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const invoicetHistory = context => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVOICE_HISTORY_API)
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
  receiveInvoice,
  receiptInvoice,
  getInvoiceCompanyList,
  saveInvoiceCompany,
  invoiceCompanyDetail,
  modifyInvoiceCompany,
  getReceiptList,
  saveReceipt,
  ReceiptDetail,
  modifyReceipt,
  invoicetHistory
}
