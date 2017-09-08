const builder = require('botbuilder');
module.exports = [
	(session) => {
		builder.Prompts.time(session, 'start_date_prompt');
	},
	(session, results) => {
		if (results.response) {
			session.dialogData.startDate = builder.EntityRecognizer.resolveTime([results.response]);
			builder.Prompts.time(session, 'end_date_prompt');
		}
		else{
			session.replaceDialog('dateRange');
		}
	},
	(session, results) => {
		if (results.response) {
			session.dialogData.endDate = builder.EntityRecognizer.resolveTime([results.response]);
			session.endDialogWithResult({startDate: session.dialogData.startDate, endDate: session.dialogData.endDate})
		}
		else {
			session.replaceDialog('dateRange');
		}
	}
]