const PURCHASE_API = '/api/hardware'
const INVENTORY_DETAIL_API = '/api/hardwarechange'
const CONTRACT_HARDWARE_API = '/api/contract_hardware'

const HOST = process.env.SERVER_URL

// 库存明细列表
const getStorageDetailList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVENTORY_DETAIL_API + '/list', { params: params })
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
      .post(HOST + INVENTORY_DETAIL_API + '/chuchang', params)
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
      .get(HOST + CONTRACT_HARDWARE_API, { params: params })
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
      .get(HOST + INVENTORY_DETAIL_API + '/list', { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 调拨记录详情
const getRecordsDetails = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVENTORY_DETAIL_API + '/list', { params: params })
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
      .post(HOST + INVENTORY_DETAIL_API + '/list', params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 调拨记录修改
const modifyRecords = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + INVENTORY_DETAIL_API + '/list', params)
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
      .get(HOST + INVENTORY_DETAIL_API + '/list', { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 仓库详情
const getStoreDetails = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVENTORY_DETAIL_API + '/list', { params: params })
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
      .post(HOST + INVENTORY_DETAIL_API + '/list', params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 仓库修改
const modifyStore = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + INVENTORY_DETAIL_API + '/list', params)
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
      .get(HOST + INVENTORY_DETAIL_API + '/list', { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 库位详情
const getLocationDetails = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVENTORY_DETAIL_API + '/list', { params: params })
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
      .post(HOST + INVENTORY_DETAIL_API + '/list', params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 库位修改
const modifyLocation = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + INVENTORY_DETAIL_API + '/list', params)
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
      .get(HOST + INVENTORY_DETAIL_API + '/list', { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 产品详情
const getProductDetails = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + INVENTORY_DETAIL_API + '/list', { params: params })
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
      .post(HOST + INVENTORY_DETAIL_API + '/list', params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 产品修改
const modifyProduct = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + INVENTORY_DETAIL_API + '/list', params)
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
  getProductDetails
}
