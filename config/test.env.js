'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  DOMAIN: '"newgls.cn"',
  LOGIN_URL: '"http://ad.newgls.cn/login"',
  SERVER_URL: '"http://papi.newgls.cn"',
  HTTPS_SERVER_URL: '"https://papi.newgls.cn"',
  CDN_URL: "'http://cdn.exe666.com/'"
})
