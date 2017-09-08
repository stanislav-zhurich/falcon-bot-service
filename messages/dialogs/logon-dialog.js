/**
 * Created by Stanislav_Zhurich on 9/6/2017.
 */
const builder = require('botbuilder'),
	_ = require('lodash'),
	oauthRequestBuilder = require('../authentication/oauth-request-builder');
module.exports = [
	(session) => {
		if(!_.isNil(session.userData.oauth)) {
			session.replaceDialog('menu');
		}
		else {
			builder.Prompts.choice(session, 'tenant_prompt', 'manufacturing|combined', {listStyle: builder.ListStyle.button});
		}
	},
	(session, results) =>  {
		let tenant = results.response.entity;
		session.userData.tenant = tenant;
		let msg = new builder.Message(session)
			.attachments([
				new builder.SigninCard(session)
					.text(`signin_prompt`)
					.button('signin_button', oauthRequestBuilder.authorizationUrl(session.message.address, tenant))
			]);
		session.send(msg);
		session.endDialog();
	}
]