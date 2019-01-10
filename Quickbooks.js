var Quickbooks = require('./node-quickbooks')
Quickbooks.setOauthVersion('2.0', false)

let qbo = {};

module.exports = {
    qbo,
    Quickbooks
}
