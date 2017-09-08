"use strict";
const builder = require('botbuilder'),
	botbuilder_azure = require('botbuilder-azure'),
	path = require('path'),
	uuid = require('uuid'),
	devServer = require('./dev-server'),
	devMode = (process.env.NODE_ENV == 'development'),
	connector = devMode ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
		appId: process.env['MicrosoftAppId'],
		appPassword: process.env['MicrosoftAppPassword'],
		stateEndpoint: process.env['BotStateEndpoint'],
		openIdMetadata: process.env['BotOpenIdMetadata']
	});
//require('./dialogs/logon-dialog')
let bot = new builder.UniversalBot(connector, require('./dialogs/logon-dialog'));
bot.dialog('menu', require('./dialogs/menu-dialog')).triggerAction({
	matches: /^menu/i
});
bot.dialog('punches', require('./dialogs/punch-dialog')).triggerAction({
	matches: /^punches/i
});

bot.dialog('logout', require('./dialogs/logout-dialog')).triggerAction({
	matches: /^logout|^bye/i
});
bot.dialog('dateRange', require('./dialogs/date-range-dialog'));

//trigger message after user is authenticated
bot.on('trigger', function(message) {
	triggerSuccessAuthentication(message);
});

function triggerSuccessAuthentication(message) {
	let address = message.value.address;
	bot.loadSession(address, (err, session) => {
		session.userData = message.value;
		session.send('Hello ' + session.userData.user.fullName);
		session.beginDialog('menu');
	});
}

function triggerFailedAuthentication(message){
	let address = message.value.address;
	bot.loadSession(address, (err, session) => {
		session.endDialog("Can't be authenticated")
	});
}

bot.use({
	receive: function (event, next) {
		console.info(event);
		next();
	},
	send: function(args, next) {
		console.info(event);
		next();
	}
});


if (devMode) {
	devServer.listen(3978, connector, triggerSuccessAuthentication, triggerFailedAuthentication);
} else {
	module.exports = {default: connector.listen()}
}
