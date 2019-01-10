let router = require('express').Router()
let oauthClient = require('../../oAuthClient')
let quickBooks = require('../../Quickbooks')

router.post('/', (req, res, next) => {
    quickBooks.qbo.emailInvoice(req.body.invoiceId, req.body.email, (err, invoice) => {
        if (invoice) {
            res.send(invoice)
        } else {
            res.status(400).send(err)
        }
    })
})


module.exports = router