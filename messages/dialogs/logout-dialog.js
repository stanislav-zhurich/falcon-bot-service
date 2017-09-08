/**
 * Created by Stanislav_Zhurich on 9/6/2017.
 */
const builder = require('botbuilder'),
	_ = require('lodash'),
	oauthRequestBuilder = require('../authentication/oauth-request-builder');
module.exports = [
	(session) => {
		session.userData.oauth = null;
		session.userData.user = null;
		session.userData.tenant = null;
		session.endConversation('end_conversation');
	}
]