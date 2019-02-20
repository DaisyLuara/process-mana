const CONTRACT_API = '/api/contract'
const CONTRACT_REMIND_API = '/api/remind_contract'
const CONTRACT_HISTORY_API = '/api/contract_history'
const CONTRACT_REJECT_API = '/api/contract/reject'
const HOST = process.env.SERVER_URL
// 合同列表
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
// 收款合同列表
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
// 新增合同
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
// 合同详情
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
// 合同修改
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
// 合同删除
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
const auditingContract = (context, contractId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + CONTRACT_API + '/auditing/' + contractId, params)
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
// 合同历史记录
const contractHistory = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + CONTRACT_HISTORY_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 驳回
const rejectContract = (context, contractId, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + CONTRACT_REJECT_API + '/' + contractId, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 编辑合同
const mofifyContract = (context, contractId, params) => {
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
export {
  getContractList,
  saveContract,
  contractDetail,
  modifyContract,
  deleteContract,
  auditingContract,
  specialAuditingContract,
  getRemindContractList,
  contractHistory,
  rejectContract,
  mofifyContract
}
