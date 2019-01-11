const HOST = process.env.SERVER_URL

const PERSON_REWARD_API = '/api/person_reward'
const FUTURE_REWARD_API = '/api/person_future_reward'

// 个人奖金列表
const getPersonRewardList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PERSON_REWARD_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 累记奖金
const getPersonRewardTotal = context => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PERSON_REWARD_API + '/total')
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 个人冻结奖金金额
const getPersonFutureRewardTotal = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + FUTURE_REWARD_API + '/total', { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 冻结明细列表
const getFutureRewardList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + FUTURE_REWARD_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export {
  getPersonRewardList,
  getPersonRewardTotal,
  getPersonFutureRewardTotal,
  getFutureRewardList
}
