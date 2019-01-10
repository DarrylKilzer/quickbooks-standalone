var Quickbooks = require('./node-quickbooks')
Quickbooks.setOauthVersion('2.0', true)

let qbo = {};

module.exports = {
    qbo,
    Quickbooks
}
