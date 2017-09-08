const request = require('request'),
	rp = require('request-promise'),
	_ = require('lodash'),
	jwtDecode = require('jwt-decode'),
	oauthRequestBuilder = require('./oauth-request-builder'),
	PersonalityService = require('./../services/personality-service'),
	OAUTH_CLIENT_ID = process.env['OAUTH_CLIENT_ID'],
	OAUTH_CLIENT_SECRET = process.env['OAUTH_CLIENT_SECRET'],
	REDIRECT_URI = process.env['REDIRECT_URI'],
	USER = process.env['USER'],
	PASSWORD = process.env['PASSWORD'],
	GRAND_TYPE = process.env['GRAND_TYPE'];

module.exports = function(req, resp, successCallback, failedCallback) {
	let responseToBot = {
			value: {
				oauth: null,
				user: null,
				address: oauthRequestBuilder.decodeState(req.query.state).address
			}
		},
		userNameFromToken,
		options;
	if (GRAND_TYPE === 'password') {
		options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			url: oauthRequestBuilder.authorizationTokenUrl(req.query.state) +
			`?grant_type=${GRAND_TYPE}&username=${USER}&password=${PASSWORD}&client_id=${OAUTH_CLIENT_ID}&client_secret=${OAUTH_CLIENT_SECRET}`
		};
	}
	else {
		options = {
			method: 'POST',
			url: oauthRequestBuilder.authorizationTokenUrl(req.query.state),
			auth: {
				user: OAUTH_CLIENT_ID,
				pass: OAUTH_CLIENT_SECRET
			},
			form: {
				grant_type: 'authorization_code', redirect_uri: REDIRECT_URI, code: req.query.code
			}
		};

	}

	//get authorization_token
	rp(options)
		.then(body => {
			responseToBot.value.oauth = JSON.parse(body);
			userNameFromToken = jwtDecode(responseToBot.value.oauth.id_token).sub;
			return responseToBot.value.oauth.access_token;
		})
		//exchange token to cookies
		.then(accessToken => {
			let options = {
				method: 'POST',
				resolveWithFullResponse: true,
				url: oauthRequestBuilder.authenticationTokenUrl(req.query.state, accessToken)
			};
			return rp(options);
		})
		.then(response => {
			let service = new PersonalityService();
			responseToBot.value.oauth.authCookies = response.headers['set-cookie'];
			return service.findUserByName(userNameFromToken, responseToBot.value.oauth.authCookies);
		})
		.then(response => {
			successCallback(responseToBot);
			responseToBot.value.user = response;
			resp.send('Authentication succeeded. You can close browser window.');
		})
		.catch(err => {
			console.error(err);
			failedCallback(err);
			resp.send(401, "error during client authentication");
		})
}