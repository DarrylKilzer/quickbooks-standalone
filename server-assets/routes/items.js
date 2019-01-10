let router = require('express').Router()
let oauthClient = require('../../oAuthClient')
let quickBooks = require('../../Quickbooks')

//all items
router.get('/', (req, res, next) => {
    quickBooks.qbo.findItems({ fetchAll: true }, (err, items) => {
        res.send(items)
    })
})

//get one item by id
router.get('/:id', (req, res, next) => {
    quickBooks.qbo.getItem(req.params.id, (err, item) => {
        res.send(item)
    })
})

//make an item
router.post('/', (req, res, next) => {
    quickBooks.qbo.createItem(req.body, (err, item) => {
        if (item) {
            res.send(item)
        } else {
            res.status(400).send(err)
        }
    })
})

//update an item
router.put('/:id', (req, res, next) => {
    quickBooks.qbo.updateItem(req.body, (err, item) => {
        if (item) {
            res.send(item)
        } else {
            res.status(400).send(err)
        }
    })
})


module.exports = router