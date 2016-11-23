var express = require('express')
var router = express.Router()

var Alipay = require('global-alipay')
// set config file.
var config = {}

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.route('/payment')
  .get(
    function (req, res, next) {
      res.render('alipay/payment', {
        title: 'Hello World'
      })
    }
)
  .post(
    function (req, res, next) {
      var alipay = new Alipay(config)
      var payment = {}
      payment.out_trade_no = req.body.WIDout_trade_no
      payment.currency = req.body.WIDcurrency
      payment.subject = req.body.WIDsubject
      payment.body = req.body.WIDbody
      payment.total_fee = req.body.WIDtotal_fee
      payment.notify_url = 'http://127.0.0.1:3000/notify'
      payment.return_url = 'http://127.0.0.1:3000/return'
      res.send(alipay.payment(payment))
    }
)

router.route('/notify')
  .post(
    function (req, res, next) {
      res.send(req.body)
    }
)

router.route('/return')
  .get(
    function (req, res) {
      res.send(req.query)
    }
)

module.exports = router
