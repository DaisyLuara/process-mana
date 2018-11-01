const CONTRACT_API = '/api/contract'
const CONTRACT_REMIND_API = '/api/remind_contract'
const HOST = process.env.SERVER_URL

const getContractList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + CONTRACT_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const getRemindContractList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + CONTRACT_REMIND_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const saveContract = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + CONTRACT_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const contractDetail = (context, contractId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + CONTRACT_API + '/' + contractId, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const modifyContract = (context, contractId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + CONTRACT_API + '/' + contractId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const deleteContract = (context, contractId) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .delete(HOST + CONTRACT_API + '/' + contractId)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 审批合同
const auditingContract = (context, contractId) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + CONTRACT_API + '/auditing/' + contractId)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 特批合同
const specialAuditingContract = (context, contractId) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + CONTRACT_API + '/special_auditing/' + contractId)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export {
  getContractList,
  saveContract,
  contractDetail,
  modifyContract,
  deleteContract,
  auditingContract,
  specialAuditingContract,
  getRemindContractList
}
