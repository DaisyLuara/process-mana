'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  DOMAIN: '"xingstation.net"',
  LOGIN_URL: '"http://ad.xingstation.net/login"',
  SERVER_URL: '"http://papi.xingstation.net"',
  HTTPS_SERVER_URL: '"https://papi.xingstation.net"',
  CDN_URL: "'http://cdn.xingstation.cn/'"
})
