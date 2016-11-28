var AlipayCore = require('./AlipayCore')
var MD5 = require('./MD5')

function AlipaySubmit (config) {
  this.config = config
}

AlipaySubmit.prototype.buildRequest = function (params, method) {
  params.service = this.config.service
  params.partner = this.config.partner
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

AlipaySubmit.prototype.buildRequestPara = function (params) {
  var alipayCore = new AlipayCore(this.config)
  var paraFilter = alipayCore.paraFilter(params)
  var paraSort = alipayCore.paraSort(paraFilter)
  paraSort.sign = this.buildRequestMysign(paraSort)
  paraSort.sign_type = this.config.sign_type.trim().toUpperCase()
  return paraSort
}

AlipaySubmit.prototype.buildRequestMysign = function (params) {
  var alipayCore = new AlipayCore(this.config)
  var prestr = alipayCore.createLinkString(params)

  var mysign = ''
  var signType = this.config.sign_type.trim().toUpperCase()
  if (signType === 'MD5') {
    mysign = MD5.sign(prestr, this.config.key)
  }
  return mysign
}

module.exports = AlipaySubmit
