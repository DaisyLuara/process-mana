const HOST = process.env.SERVER_URL

const PERSON_REWARD_API = '/api/person_reward'
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

export{ getPersonRewardList, getPersonRewardTotal }
