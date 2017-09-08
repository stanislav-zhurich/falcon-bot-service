/**
 * Created by Stanislav_Zhurich on 9/3/2017.
 */
const request = require('request'),
	rp = require('request-promise'),
	_ = require('lodash'),
	jwtDecode = require('jwt-decode'),
	oauthRequestBuilder = require('./authentication/oauth-request-builder'),
	PersonalityService = require('./services/personality-service'),
	OAUTH_CLIENT_ID = process.env['OAUTH_CLIENT_ID'],
	OAUTH_CLIENT_SECRET = process.env['OAUTH_CLIENT_SECRET'],
	REDIRECT_URI = process.env['REDIRECT_URI'];

module.exports.listen = function(port = 3978, connector, callback) {
	let server = require('restify').createServer();
	server.use(require('restify-plugins').queryParser());
	server.listen(port, function() {
		console.log('test bot endpont at http://localhost:3978/api/messages');
	});
	server.post('/api/messages', connector.listen());
	server.get('/api/oauth/callback', (req, resp) => require('./authentication/oauth-authentication')(req, resp, callback));
}