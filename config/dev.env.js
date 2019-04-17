'use strict'
const merge = require('webpack-merge')
const devEnv = require('./prod.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"development"',
  DOMAIN: '"jingfree.top"',
  LOGIN_URL: '"http://devad.jingfree.top/login"',
  SERVER_URL: '"http://papi.xingstation.net"',
  HTTPS_SERVER_URL: '"https://papi.xingstation.net"',
  CDN_URL: "'http://cdn.xingstation.cn/'"
})
