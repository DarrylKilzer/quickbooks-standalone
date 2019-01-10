var express = require('express')
var bp = require('body-parser')
var app = express()
var cors = require('cors')
var port = process.env.PORT || 3000
var whitelist = ['http://localhost:8080', 'http://localhost:8081', 'https://gatbuilder.herokuapp.com']
var urlencodedParser = bp.urlencoded({ extended: false })
var OAuthClient = require('intuit-oauth')
var oauthClient = require('./oAuthClient')
var quickBooks = require('./Quickbooks')

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
    var authUri = oauthClient.authorizeUri({ scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.Payment], state: 'intuit-test' });
    res.redirect(authUri);
})


app.get('/callback', function (req, res) {
    oauthClient.createToken(req.url)
        .then(function (authResponse) {
            oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
            quickBooks.qbo = new quickBooks.Quickbooks(
                oauthClient.clientId,
                oauthClient.clientSecret,
                oauthClient.token.access_token,
                false,
                oauthClient.token.realmId,
                false,
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
var itemRoutes = require('./server-assets/routes/items')
var invoiceRoutes = require('./server-assets/routes/invoices')
var emailRoutes = require('./server-assets/routes/emails')

//GATEKEEPER
// Deny any request that is not a get or does not have a session, if it has a session add the creatorId
app.use('/api/*', (req, res, next) => {
    if (!quickBooks.qbo.createItem) {
        res.redirect('/start')
    }
    else { next() }
})
console.log("Message from the server in the browser!!! COOL")

//Actual routes here
//@ts-ignore
app.use('/api/items', itemRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/emails', emailRoutes)

//Catch all
app.get('*', (error, req, res, next) => {
    res.status(400).send({
        error: error && error.message ? error.message : 'bad request'
    })
})

app.listen(port, () => {
    console.log('app running on port', port)
})
