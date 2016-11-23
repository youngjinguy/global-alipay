var crypto = require('crypto')

exports.sign = function (prestr, key) {
  prestr = prestr + key
  return crypto.createHash('md5').update(prestr, 'utf8').digest('hex')
}
