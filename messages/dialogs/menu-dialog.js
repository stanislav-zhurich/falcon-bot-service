const builder = require('botbuilder'),
	_ = require('lodash'),
	dialogUtils = require('./dialog-utils'),

	menuOptions = new Map([
		[0, {name: 'menu_accrual_balance', dialog: null}],
		[1, {name: 'menu_sick_day', dialog: null}],
		[2, {name: 'menu_worked_hours', dialog: null}],
		[3, {name: 'menu_absence', dialog: null}],
		[4, {name: 'menu_punch_list', dialog: 'punches'}],
		[5, {name: 'menu_overtime', dialog: null}]
	]);

module.exports = [
	(session) => {
		let options = _.map(Array.from(menuOptions.values()), (entry) => {
			return dialogUtils.localizeValue(session, entry.name);
		}).join(' | ');
		builder.Prompts.choice(session, dialogUtils.localizeValue(session, "menu_choice_prompt"), options, {listStyle: builder.ListStyle.button});
	},
	(session, results) => {
		let menuOption = menuOptions.get(results.response.index);
		session.beginDialog(menuOption.dialog)
	},
	(session, results) => {
		session.endDialogWithResult(results);
	}
]


