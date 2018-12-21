var OAuthClient = require('intuit-oauth')

module.exports = new OAuthClient({
    clientId: 'Q0FKrAYW5ORFZIoN4uF97sNxCu8RT5Abwy1Jl6LGEUaLy5Wtl7',
    clientSecret: 'Kc3W9napNn574dWB7sdc4gH7kIJRW9BN9idicLVK',
    environment: 'sandbox',
    redirectUri: 'http://localhost:3000/callback'
});