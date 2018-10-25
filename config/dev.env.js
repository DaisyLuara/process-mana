'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"development"',
  SERVER_URL: '"http://papi.jingfree.top"',
  HTTPS_SERVER_URL: '"https://papi.jingfree.top"',
  CDN_URL: "'http://cdn.exe666.com/'"
})
