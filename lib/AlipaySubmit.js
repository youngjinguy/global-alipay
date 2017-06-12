var _ = require('lodash')
var request = require('request')

var AlipayCore = require('./AlipayCore')
var MD5 = require('./MD5')

function AlipaySubmit (config) {
  this.config = config
}

AlipaySubmit.prototype.buildRequest = function (params, method) {
  var para = this.buildRequestPara(params)
  var html = [
    '<form id="alipaysubmit" name="alipaysubmit" action="',
    this.config.gateway,
    '" method="',
    method,
    '">'
  ]

  for (var key in para) {
    html.push('<input type="hidden" name="' + key + '" value="' + para[key] + '"/>')
  }

  html.push('</form>')
  html.push('<script>document.forms["alipaysubmit"].submit();</script>')
  return html.join('')
}

/**
 * request remote data
 * @method request
 * @param  {object} param
 * @param  {string} [param.method]
 * @param  {object} param.data
 * @param  {Function} cb
 */
AlipaySubmit.prototype.request = function (param, cb) {
  var opts = {
    method: param.method || 'GET',
    url: this.config.gateway
  }
  if (!param.method || param.method === 'GET') {
    opts.qs = param.data
  } else {
    opts.data = param.data
  }
  return request(opts, cb)
}

AlipaySubmit.prototype.buildRequestPara = function (params) {
  var alipayCore = new AlipayCore()
  var paraFilter = alipayCore.paraFilter(_.extend({
    partner: this.config.partner
  }, params))
  var paraSort = alipayCore.paraSort(paraFilter)
  paraSort.sign = this.buildRequestMysign(paraSort)
  paraSort.sign_type = this.config.sign_type.trim().toUpperCase()
  return paraSort
}

AlipaySubmit.prototype.buildRequestMysign = function (params) {
  var alipayCore = new AlipayCore()
  var prestr = alipayCore.createLinkString(params)

  var mysign = ''
  var signType = this.config.sign_type.trim().toUpperCase()
  if (signType === 'MD5') {
    mysign = MD5.sign(prestr, this.config.key)
  }
  return mysign
}

module.exports = AlipaySubmit
