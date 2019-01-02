const INVOICE_API = '/api/invoice'
const INVOICE_COMPANY_API = '/api/invoice_company'
const INVOICE_HISTORY_API = '/api/invoice_history'
const INVOICE_REJECT_API = '/api/invoice/reject'
const INVOICE_RECEIPT_API = '/api/invoice_receipt'

const HOST = process.env.SERVER_URL
// 票据列表
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
// 保存票据
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
// 票据详情
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
// 修改票据
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
// 删除票据
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
const auditingInvoice = (context, invoiceId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + INVOICE_API + '/auditing/' + invoiceId, params)
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

// 认领收款
const receiptInvoice = (context, receiptId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + INVOICE_RECEIPT_API + '/confirm/' + receiptId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 票据公司列表
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
// 保存票据公司
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
// 票据公司详情
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
// 修改票据公司
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
// 收据列表
const getReceiptList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVOICE_RECEIPT_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 保存收据
const saveReceipt = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + INVOICE_RECEIPT_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 收据详情
const ReceiptDetail = (context, receiptId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVOICE_RECEIPT_API + '/' + receiptId, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 修改收据
const modifyReceipt = (context, receiptId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + INVOICE_RECEIPT_API + '/' + receiptId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 票据历史记录
const invoicetHistory = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVOICE_HISTORY_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 驳回
const rejectInvoice = (context, invoiceId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + INVOICE_REJECT_API + '/' + invoiceId, params)
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
  invoicetHistory,
  rejectInvoice
}
