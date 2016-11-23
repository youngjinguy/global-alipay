var _ = require('lodash')

var AlipaySubmit = require('./AlipaySubmit')

// test key
// real gate way = https://mapi.alipay.com/gateway.do?
var defaultConfig = {
  partner: '2088101122136241',
  key: '760bdzec6y9goq7ctyx96ezkz78287de',
  gateway: 'https://openapi.alipaydev.com/gateway.do?',
  service: 'create_forex_trade',
  input_charset: 'utf-8',
  sign_type: 'MD5'
}

function Alipay (config) {
  this.config = config ? _.assignIn(defaultConfig, config) : defaultConfig
}

Alipay.prototype.payment = function (params) {
  var alipaySubmit = new AlipaySubmit(this.config)
  return alipaySubmit.buildRequest(params, 'get')
}

module.exports = Alipay
