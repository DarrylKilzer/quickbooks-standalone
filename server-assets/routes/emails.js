let router = require('express').Router()
let oauthClient = require('../../oAuthClient')
let quickBooks = require('../../Quickbooks')

router.post('/', (req, res, next) => {
    quickBooks.qbo.emailInvoice(151, "darrylkilzer@gmail.com", (err, invoice) => {
        if (invoice) {
            res.send(invoice)
        } else {
            res.status(400).send(err)
        }
    })
})


module.exports = router