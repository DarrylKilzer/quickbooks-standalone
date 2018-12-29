let router = require('express').Router()
let oauthClient = require('../../oAuthClient')
let OauthClient = require('intuit-oauth')
var url = oauthClient.environment == 'sandbox' ? 'https://sandbox-quickbooks.api.intuit.com' : 'https://quickbooks.api.intuit.com';
let axios = require('axios')
let QuickBooks = require('../../Quickbooks')

let intuit = axios.create({
    baseURL: url,
    timeout: 1000,
    withCredentials: true
})
//all items
router.get('/', (req, res, next) => {
    QuickBooks.qbo.findItems({ fetchAll: true }, function (e, items) {
        res.send(items)
    })
})
//get one item by id
router.get('/:id', (req, res, next) => {
    QuickBooks.qbo.getItem(req.params.id, function (e, item) {
        res.send(item)
    })
})

module.exports = router