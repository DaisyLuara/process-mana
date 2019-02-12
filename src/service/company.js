const CUSTOMER_API = '/api/companies'
const HOST = process.env.SERVER_URL

// 客户保存／编辑
const saveCustomer = (context, args, uid) => {
  if (uid) {
    // 修改
    return new Promise(function(resolve, reject) {
      context.$http
        .patch(HOST + CUSTOMER_API + '/' + uid, args)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  } else {
    // 新增
    return new Promise(function(resolve, reject) {
      context.$http
        .post(HOST + CUSTOMER_API + '?include=user,bdUser', args)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
// 联系人列表
const getContactList = (context, uid, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + CUSTOMER_API + '/' + uid + '/customers', args)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 联系人的保存／修改
const saveContact = (context, pid, args, uid) => {
  if (uid) {
    return new Promise(function(resolve, reject) {
      context.$http
        .patch(HOST + CUSTOMER_API + '/' + pid + '/customers/' + uid, args)
        .then(response => {
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  } else {
    return new Promise(function(resolve, reject) {
      context.$http
        .post(HOST + CUSTOMER_API + '/' + pid + '/customers', args)
        .then(response => {
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
// 联系人详情
const getContactDetail = (context, pid, uid) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + CUSTOMER_API + '/' + pid + '/customers/' + uid)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 客户详情
const getCustomerDetial = (context, pid) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + CUSTOMER_API + '/' + pid + '?include=customers,bdUser')
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 客户列表
const getCustomerList = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + CUSTOMER_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export {
  saveCustomer,
  getContactList,
  saveContact,
  getContactDetail,
  getCustomerDetial,
  getCustomerList
}
