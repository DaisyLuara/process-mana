const STORAGE_API = '/api/warehouse'
const LOCATION_API = '/api/location'
const PRODUCT_API = '/api/product'
const ATTRIBUTE_API = '/api/attribute/list'
const STORAGE_DETAIL_API = '/api/location_product'
const RECORDS_API = '/api/warehousechange'
const CONTRACT_PRODUCT_API = '/api/contract_product'
const PRODUCT_ATTRIBUTE_API = '/api/product_attribute'

const HOST = process.env.SERVER_URL

// 库存明细列表
const getStorageDetailList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + STORAGE_DETAIL_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 采购硬件出厂
const leaveFactory = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + RECORDS_API + '/chuchang', params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 采购硬件出厂详情
const leaveFactoryDetail = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + CONTRACT_PRODUCT_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 调拨记录列表
const getRecordsList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + RECORDS_API + '/list', { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 调拨记录详情
const getRecordsDetails = (context, recordId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + RECORDS_API + '/' + recordId, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 调拨记录增加
const saveRecords = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + RECORDS_API + '/create', params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 仓库列表
const getStoreList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + STORAGE_API + '/list', { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 仓库详情
const getStoreDetails = (context, storageId) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + STORAGE_API + '/' + storageId)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 仓库增加
const saveStore = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + STORAGE_API + '/create', params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 仓库修改
const modifyStore = (context, storageId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + STORAGE_API + '/' + storageId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 库位列表
const getLocationList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + LOCATION_API + '/list', { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 库位详情
const getLocationDetails = (context, locationId) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + LOCATION_API + '/' + locationId)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 库位增加
const saveLocation = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + LOCATION_API + '/create', params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 库位修改
const modifyLocation = (context, locationId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + LOCATION_API + '/' + locationId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 产品列表
const getProductList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PRODUCT_API + '/list', { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 产品详情
const getProductDetails = (context, productId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PRODUCT_API + '/' + productId, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 产品增加
const saveProduct = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + PRODUCT_API + '/create', params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 产品修改
const modifyProduct = (context, productId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + PRODUCT_API + '/' + productId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 产品属性列表
const getAttributeList = (context, params) => {
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

// 根据产品SKU，查出对应产品属性
const getAttributeBySku = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PRODUCT_ATTRIBUTE_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export {
  getStorageDetailList,
  leaveFactory,
  leaveFactoryDetail,
  getRecordsList,
  getRecordsDetails,
  saveRecords,
  modifyRecords,
  modifyStore,
  saveStore,
  getStoreDetails,
  getStoreList,
  getLocationList,
  modifyLocation,
  saveLocation,
  getLocationDetails,
  getProductList,
  modifyProduct,
  saveProduct,
  getProductDetails,
  getAttributeList,
  getAttributeBySku
}
