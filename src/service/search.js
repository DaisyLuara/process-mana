const COMPANY_QUERY_API = '/api/company/query'
const CONTRACT_QUERY_API = '/api/contract/query'
const INVOICE_COMPANY_QUERY_API = '/api/invoice_company/query'
const PAYMENT_PAYEE_QUERY_API = '/api/payment_payee/query'
const GOODS_SERVICE_QUERY_API = '/api/goods_service/query'
const RECEIVE_DATE_QUERY_API = '/api/receive_date/query'
const INVOICE_KIND_API = '/api/invoice_kind/query'
const HARDWARE_MODEL_API = '/api/hardware_model/query'
const HARDWARE_COLOR_API = '/api/hardware_color/query'
const HARDWARE_SOURCE_API = '/api/hardware_source/query'

const HOST = process.env.SERVER_URL

const getCompanyList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + COMPANY_QUERY_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const getInvoiceKindList = context => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVOICE_KIND_API)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const getContract = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + CONTRACT_QUERY_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 货物服务下拉列表
const goodsService = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + GOODS_SERVICE_QUERY_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 开票公司下拉列表
const getInvoiceCompany = context => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVOICE_COMPANY_QUERY_API)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 收款人下拉列表
const getPaymentPayee = context => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PAYMENT_PAYEE_QUERY_API)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 收到款的日期
const getReceiveDate = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + RECEIVE_DATE_QUERY_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 硬件型号查询
const hardwareModel = context => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + HARDWARE_MODEL_API)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 硬件型号对应的颜色查询
const hardwareColorByModel = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + HARDWARE_COLOR_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 硬件出处查询
const hardwareSource = context => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + HARDWARE_SOURCE_API)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export {
  getCompanyList,
  getContract,
  goodsService,
  getInvoiceCompany,
  getPaymentPayee,
  getReceiveDate,
  getInvoiceKindList,
  hardwareModel,
  hardwareColorByModel,
  hardwareSource
}
