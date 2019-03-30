'use strict'
const merge = require('webpack-merge')
const devEnv = require('./prod.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"development"',
  DOMAIN: '"jingfree.top"',
  LOGIN_URL: '"http://devad.jingfree.top/login"',
  SERVER_URL: '"http://papi.jingfree.top"',
  HTTPS_SERVER_URL: '"https://papi.jingfree.top"',
  CDN_URL: "'http://cdn.xingstation.cn/'"
})
