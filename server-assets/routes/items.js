let router = require('express').Router()
let oauthClient = require('../../oAuthClient')
let OauthClient = require('intuit-oauth')
var url = oauthClient.environment == 'sandbox' ? 'https://sandbox-quickbooks.api.intuit.com' : 'https://quickbooks.api.intuit.com';
let axios = require('axios')

let intuit = axios.create({
    baseURL: url,
    timeout: 1000,
    headers: {
        "Authorization": "Bearer " + oauthClient.authHeader(),
        "User-Agent": OauthClient.user_agent
    }
})
//get one item by id
router.get('/:id', (req, res, next) => {
    let companyID = oauthClient.token.realmId
    intuit.get(`/v3/company/${companyID}/item/${req.params.id}`)
        .then(apiRes => {
            res.send(apiRes.text())
        })
        .catch(e => {
            console.error(e);
            res.status(401).send(e)
        });
})

module.exports = router