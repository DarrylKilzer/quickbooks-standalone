var express = require('express')
var bp = require('body-parser')
var app = express()
var cors = require('cors')
var port = process.env.PORT || 3000
var whitelist = ['http://localhost:8080', 'http://localhost:8081']
let axios = require('axios')
var urlencodedParser = bp.urlencoded({ extended: false })
var OAuthClient = require('intuit-oauth')
var oauthClient = require('./oAuthClient')
var QuickBooks = require('./Quickbooks')



var corsOptions = {
    origin: function (origin, callback) {
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        originIsWhitelisted = true
        callback(null, originIsWhitelisted);
    },
    credentials: true
};

app.use(cors(corsOptions))

var oauth2_token_json;




//Fire up database connection
// require('./db/mlab-config')

//REGISTER MIDDLEWARE
app.use(bp.json())
app.use(bp.urlencoded({
    extended: true
}))

//serve static files(prolly not needed)
// app.use(express.static(__dirname + '/../www/'))

app.get('/start', urlencodedParser, (req, res) => {
    var authUri = oauthClient.authorizeUri({ scope: [OAuthClient.scopes.Accounting], state: 'intuit-test' });
    res.send(authUri);
})

app.get('/callback', function (req, res) {

    oauthClient.createToken(req.url)
        .then(function (authResponse) {
            oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
            QuickBooks.qbo = new QuickBooks.Quickbooks(
                oauthClient.clientId,
                oauthClient.clientSecret,
                oauthClient.token.access_token,
                false,
                oauthClient.token.realmId,
                true,
                true,
                4,
                '2.0',
                oauthClient.token.refresh_token)
            res.redirect('/api/items');
        })
        .catch(function (e) {
            console.error(e);
        });

});

app.get('/getCompanyInfo', function (req, res) {
    var companyID = oauthClient.token.realmId;

    var url = oauthClient.environment == 'sandbox' ? 'https://sandbox-quickbooks.api.intuit.com' : 'https://quickbooks.api.intuit.com';

    oauthClient.makeApiCall({ url: url + '/v3/company/' + companyID + '/companyinfo/' + companyID })
        .then(function (authResponse) {
            console.log("The response for API call is :" + JSON.stringify(authResponse));
            res.send(JSON.parse(authResponse.text()));
        })
        .catch(function (e) {
            console.error(e);
            res.status(401).send(e)
        });
});

//REGISTER YOUR AUTH ROUTES BEFORE YOUR GATEKEEPER
//firebase authentication will be moved to the app here
// let auth = require('./auth/routes')
// app.use(auth.session)
// app.use(auth.router)

//API ROUTES REQUIRING AUTH HERE
var items = require('./server-assets/routes/items')

//GATEKEEPER
// Deny any request that is not a get or does not have a session, if it has a session add the creatorId
// app.use('/api/*', (req, res, next) => {
//     // @ts-ignore
//     if (!req.session.uid && req.method != "GET") {
//         return res.status(401).send({
//             error: 'please login to continue'
//         })
//     }
//     else {
//         // @ts-ignore
//         req.creatorId = req.session.uid
//     }
//     next()
// })

//Actual routes here
//@ts-ignore
app.use('/api/items', items)

//Catch all
app.get('*', (req, res, next) => {
    res.status(404).send({
        error: 'No matching routes'
    })
})

app.get('*', (error, req, res, next) => {
    res.status(400).send({
        error: error && error.message ? error.message : 'bad request'
    })
})

app.listen(port, () => {
    console.log('app running on port', port)
})
