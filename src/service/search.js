const COMPANY_QUERY_API = '/api/company/query'
const CONTRACT_QUERY_API = '/api/contract/query'
const INVOICE_COMPANY_QUERY_API = '/api/invoice_company/query'
const PAYMENT_PAYEE_QUERY_API = '/api/payment_payee/query'
const GOODS_SERVICE_QUERY_API = '/api/goods_service/query'
const RECEIVE_DATE_QUERY_API = '/api/receive_date/query'
const PROJECT_API = '/api/projects/query'
const INVOICE_KIND_API = '/api/invoice_kind/query'
const PERMISSION_API = '/api/permission/query'
const ROLE_API = '/api/role/query'
const STORAGE_API = '/api/erp_warehouse/query'
const SUPPLIER_API = '/api/erp_supplier/query'
const SKU_API = '/api/erp_sku/query'
const LOCATION_API = '/api/erp_location/query'
const USER_API = '/api/user/query'
const COST_KIND_API = '/api/cost_kind/query'
const BD_API = '/api/bd_users/query'
const ATTRIBUTE_API = '/api/erp_attribute/query'
const USER_PERMISSION_API = '/api/user/permission/query'
const DEMAND_APPLICATION_API = '/api/demand_application/query'
const HOST = process.env.SERVER_URL
// 公司列表
const getCompany = (context, params) => {
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
// 货物种类列表
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
// 根据不同参数获取合同列表
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

// 权限树状结构
const getPermission = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PERMISSION_API, { params: args })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
// 节目
const getSearchProjectList = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PROJECT_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 角色
const getSearchRole = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + ROLE_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 仓库列表
const getSearchStorageList = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + STORAGE_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 供应商
const getSearchSupplier = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + SUPPLIER_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// sku列表
const getSearchSku = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + SKU_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 库位搜索列表
const getSearchLocation = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + LOCATION_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 用户
const getSearchUserList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + USER_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 成本种类
const getSearchCostKind = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + COST_KIND_API, { params: params })
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 产品属性列表
const getSearchAttribute = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + ATTRIBUTE_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// bd
const getSearchBD = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + BD_API, { params: params })
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 需求用户
const getSearchDemandPeople = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + USER_PERMISSION_API, { params: params })
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 申请列表
const getSearchDemandApplication = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + DEMAND_APPLICATION_API, { params: params })
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export {
  getCompany,
  getContract,
  goodsService,
  getInvoiceCompany,
  getPaymentPayee,
  getReceiveDate,
  getInvoiceKindList,
  getPermission,
  getSearchRole,
  getSearchProjectList,
  getSearchStorageList,
  getSearchSupplier,
  getSearchSku,
  getSearchLocation,
  getSearchUserList,
  getSearchCostKind,
  getSearchBD,
  getSearchAttribute,
  getSearchDemandPeople,
  getSearchDemandApplication
}
