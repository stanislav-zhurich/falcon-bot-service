/**
 * Created by Stanislav_Zhurich on 9/5/2017.
 */

'use strict';
const request = require('request'),
	rp = require('request-promise'),
	_ = require('lodash'),
	BACKEND_SERVER_URL = process.env['BACKEND_SERVER_URL'];

class AbstractService {
	constructor(){}

	_getOptions(method, authCookies, url) {
		return {
			//proxy: 'http://localhost:8888',
			method: method,
			headers: {
				'Content-Type': 'application/json',
				'Cookie': authCookies.join(';')
			},
			url: `${BACKEND_SERVER_URL}${url}?tenantId=manufacturing`
		};
	}
	_callPost(authCookies, body, url){
		let options = this._getOptions('POST', authCookies, url);
		options.body = JSON.stringify(body);
		return rp(options);
	}
	_callGet(authCookies, url){
		let options = this._getOptions('GET', authCookies, url);
		return rp(options);
	}
}

module.exports = AbstractService;