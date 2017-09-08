const builder = require('botbuilder'),
	_ = require('lodash'),
	PunchService = require('./../services/punch-service'),
	dialogUtils = require('./dialog-utils'),
	punchCard = require('./content/punc-adaptive-card.json'),

	timeFrames = new Map([
		[0, {name: 'timeframe_previous_pay_period', value: '0'}],
		[1, {name: 'timeframe_current_pay_period', value: '1'}],
		[2, {name: 'timeframe_next_pay_period', value: '2'}],
		[3, {name: 'timeframe_today', value: '13'}],
		[4, {name: 'timeframe_date_range', value: '9'}]
	]);

module.exports = [
	(session) => {
		let options = _.map(Array.from(timeFrames.values()), (entry) => {
			return dialogUtils.localizeValue(session, entry.name);
		}).join(' | ');
		builder.Prompts.choice(session, dialogUtils.localizeValue(session, "timeframe_choice_prompt"), options, {listStyle: builder.ListStyle.button});
	},
	(session, results, next) => {
		let index = results.response.index;
		session.dialogData.timeframe = timeFrames.get(index).value;
		if (index === 4) {
			session.beginDialog('dateRange');
		}
		next();
	},
	(session, results) => {
		let punchService = new PunchService();
		session.sendTyping();
		punchService.findPunches(results.startDate, results.endDate,
			session.dialogData.timeframe, session.userData.user.personNumber, session.userData.oauth.authCookies)
			.then(response => {
				let msg = new builder.Message(session);
				_.forEach(response, punch => {
					let mainRow = punch.name + ' - ' + punch.punchDateTime;
					let secondRow = 'Entered ' + punch.enteredOnDateTime;
					let card = _.cloneDeep(punchCard);
					card.content.body[0].text = mainRow;
					card.content.body[1].text = secondRow;
					msg.addAttachment(card);
				});
				session.send(msg);
				session.endDialog();
			});
	}

]