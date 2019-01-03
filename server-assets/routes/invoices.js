let router = require('express').Router()
let oauthClient = require('../../oAuthClient')
let quickBooks = require('../../Quickbooks')

//get invoices
router.get('/', (req, res, next) => {
    quickBooks.qbo.findInvoices({ fetchAll: true }, (err, invoice) => {
        if (invoice) {
            res.send(invoice)
        } else {
            res.status(400).send(err)
        }
    })
})

//get one invoice by id
router.get('/:id', (req, res, next) => {
    quickBooks.qbo.getInvoice(req.params.id, (err, invoice) => {
        if (invoice) {
            res.send(invoice)
        } else {
            res.status(400).send(err)
        }
    })
})

//make an invoice
router.post('/', (req, res, next) => {
    quickBooks.qbo.createInvoice(req.body, (err, invoice) => {
        if (invoice) {
            res.send(invoice)
        } else {
            res.status(400).send(err)
        }
    })
})

//update an invoice
router.put('/:id', (req, res, next) => {
    quickBooks.qbo.updateInvoice(req.body, (err, invoice) => {
        if (invoice) {
            res.send(invoice)
        } else {
            res.status(400).send(err)
        }
    })
})

module.exports = router