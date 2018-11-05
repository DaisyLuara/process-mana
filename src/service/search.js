const COMPANY_QUERY_API = '/api/company/query'
const CONTRACT_QUERY_API = '/api/contract/query'
const GOODS_SERVICE_QUERY_API = '/api/goods_service/query'
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
const goodsService = context => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + GOODS_SERVICE_QUERY_API)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export { getCompanyList, getContract, goodsService }
