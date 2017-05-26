var _ = require('lodash')

var AlipaySubmit = require('./AlipaySubmit')

// test key
// real gate way = https://mapi.alipay.com/gateway.do?
var defaultConfig = {
  partner: '2088101122136241',
  key: '760bdzec6y9goq7ctyx96ezkz78287de',
  gateway: 'https://openapi.alipaydev.com/gateway.do?',
  sign_type: 'MD5'
}

function Alipay (config) {
  this.config = config ? _.assignIn(defaultConfig, config) : defaultConfig
}

Alipay.prototype.payment = function (params) {
  var alipaySubmit = new AlipaySubmit(this.config)
  return alipaySubmit.buildRequest(_.extend({}, {
    service: 'create_forex_trade'
  }, params), 'get')
}

Alipay.prototype.loadExchangeRate = function (cb) {
  var alipaySubmit = new AlipaySubmit(this.config)
  var param = alipaySubmit.buildRequestPara({
    service: 'forex_rate_file'
  })
  return alipaySubmit.request({
    data: param
  }, function (err, resp, body) {
    if (err) {
      return cb(err)
    }

    cb(null, _.map(body.split('\n'), function (str) {
      var o = str.split('|')
      var dt = strToDate(o[0] + o[1])
      return {
        date: dt,
        currency: o[2],
        rate: parseFloat(o[3])
      }
    }))
  })
}

function strToDate (str) {
  return new Date(
    str.substring(0, 4),
    str.substring(4, 6),
    str.substring(6, 8),
    str.substring(8, 10),
    str.substring(10, 12),
    str.substring(12, 14)
  )
}

module.exports = Alipay
