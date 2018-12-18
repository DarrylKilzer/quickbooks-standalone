var express = require('express')
var bp = require('body-parser')
var server = express()
var cors = require('cors')
var OAuthClient = require('intuit-oauth')
var port = process.env.PORT || 3000
var whitelist = ['http://localhost:8080', 'http://localhost:8081']
let axios = require('axios')
var urlencodedParser = bp.urlencoded({ extended: false })

var corsOptions = {
    origin: function (origin, callback) {
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        originIsWhitelisted = true
        callback(null, originIsWhitelisted);
    },
    credentials: true
};

server.use(cors(corsOptions))

var oauth2_token_json;

var oauthClient = new OAuthClient({
    clientId: 'Q0FKrAYW5ORFZIoN4uF97sNxCu8RT5Abwy1Jl6LGEUaLy5Wtl7',
    clientSecret: 'Kc3W9napNn574dWB7sdc4gH7kIJRW9BN9idicLVK',
    environment: 'sandbox',
    redirectUri: 'http://localhost:3000/callback'
});


//Fire up database connection
// require('./db/mlab-config')

//REGISTER MIDDLEWARE
server.use(bp.json())
server.use(bp.urlencoded({
    extended: true
}))

//serve static files(prolly not needed)
// server.use(express.static(__dirname + '/../www/'))

server.get('/start', urlencodedParser, (req, res) => {
    var authUri = oauthClient.authorizeUri({ scope: [OAuthClient.scopes.Accounting], state: 'intuit-test' });
    res.send(authUri);
})

server.get('/callback', function (req, res) {

    oauthClient.createToken(req.url)
        .then(function (authResponse) {
            oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
        })
        .catch(function (e) {
            console.error(e);
        });

    res.send('');

});

server.get('/getCompanyInfo', function (req, res) {
    var companyID = '123146192033624';

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
//firebase authentication will be moved to the server here
// let auth = require('./auth/routes')
// server.use(auth.session)
// server.use(auth.router)

//API ROUTES REQUIRING AUTH HERE
var items = require('./server-assets/routes/items')

//GATEKEEPER
// Deny any request that is not a get or does not have a session, if it has a session add the creatorId
// server.use('/api/*', (req, res, next) => {
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
server.use('/api/items', items)

//Catch all
server.get('*', (req, res, next) => {
    res.status(404).send({
        error: 'No matching routes'
    })
})

server.get('*', (error, req, res, next) => {
    res.status(400).send({
        error: error && error.message ? error.message : 'bad request'
    })
})

server.listen(port, () => {
    console.log('server running on port', port)
})
