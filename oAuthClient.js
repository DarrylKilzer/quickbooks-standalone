var OAuthClient = require('intuit-oauth')

module.exports = new OAuthClient({
    clientId: 'Q0pgNhbEl9Oq5j00YvsLSx2Wba9khadE6XBarRjl3mbn1xasbJ',
    clientSecret: 'ecE5YlMha7KaiipKbCOzLG96pMCtu10Xnd7F5kwS',
    environment: 'production',
    redirectUri: 'http://localhost:3000/callback'
});
