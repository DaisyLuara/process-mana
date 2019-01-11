const CUSTOMER_API = '/api/companies'
const HOST = process.env.SERVER_URL

export default {
  // 客户保存／编辑
  saveCustomer(context, args, uid) {
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
          .post(HOST + CUSTOMER_API + '?include=user', args)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },
  // 联系人列表
  getConstactList(context, uid, args) {
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
  },
  // 联系人的保存／修改
  saveContact(context, pid, args, uid) {
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
  },
  getContactDetail(context, pid, uid, params) {
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + CUSTOMER_API + '/' + pid + '/customers/' + uid, {
          params: params
        })
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getCustomerDetail(context, pid, params) {
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + CUSTOMER_API + '/' + pid + '?include=customers', {
          params: params
        })
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 客户列表
  getCustomerList(context, args) {
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
}
