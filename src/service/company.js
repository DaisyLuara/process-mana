const CUSTOMER_API = '/api/companies'
const HOST = process.env.SERVER_URL

export default {
  saveCustomer(context, args, uid) {
    if (uid) {
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
