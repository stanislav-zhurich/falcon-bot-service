/**
 * Created by Stanislav_Zhurich on 9/4/2017.
 */
'use strict';
const OAUTH_SERVER_URL = process.env['OAUTH_SERVER_URL'],
	OAUTH_CLIENT_ID = process.env['OAUTH_CLIENT_ID'],
	OAUTH_CLIENT_SECRET = process.env['OAUTH_CLIENT_SECRET'],
	REDIRECT_URI = process.env['REDIRECT_URI'];

module.exports.authorizationTokenUrl = function(uriState) {
	let tenant = decodeState(uriState).tenant;
	return `${OAUTH_SERVER_URL}oauth2/${tenant}/access_token`;

}

module.exports.authenticationTokenUrl = function(uriState, accessToken) {
	let tenant = decodeState(uriState).tenant;
	return `${OAUTH_SERVER_URL}json/${tenant}/authenticate?authIndexType=service&authIndexValue=oAuthService&access_token=${accessToken}`;
}

module.exports.authorizationUrl = function(address, tenant) {
	 let state = encodeState({
  	address: address,
		tenant: tenant
	});
	return `http://localhost:3978/api/oauth/callback?response_type=code&state=${state}&realm=${tenant}&redirect_uri=${REDIRECT_URI}&client_id=${OAUTH_CLIENT_ID}`;

	//return
	// `${OAUTH_SERVER_URL}oauth2/authorize?response_type=code&state=${state}&realm=${tenant}&redirect_uri=${REDIRECT_URI}&client_id=${OAUTH_CLIENT_ID}`;
}

module.exports.decodeState = decodeState;

function decodeState(uriState) {
	return JSON.parse(Buffer.from(uriState, 'base64'));
}

function encodeState(state) {
	return new Buffer(JSON.stringify(state)).toString('base64');
}


