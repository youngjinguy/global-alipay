function AlipayCore () {
}

AlipayCore.prototype.paraFilter = function (params) {
  var result = {}
  for (var key in params) {
    if (key === 'sign' || key === 'sign_type' || params[key] === '') {
      continue
    } else {
      result[key] = params[key]
    }
  }

  return result
}

AlipayCore.prototype.createLinkString = function (params) {
  var prestr = ''
  for (var key in params) {
    prestr = prestr + key + '=' + params[key] + '&'
  }
  prestr = prestr.substring(0, prestr.length - 1)
  return prestr
}

AlipayCore.prototype.paraSort = function (params) {
  var result = {}
  var keys = Object.keys(params).sort()
  for (var index in keys) {
    result[keys[index]] = params[keys[index]]
  }
  return result
}

module.exports = AlipayCore
