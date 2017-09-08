const _ = require('lodash'),
	moment = require('moment'),
	DISPLAY_PATTERN = 'ddd MM/DD H:m',
	ISO_DATE_TIME_PATTERN = 'YYYY-MM-DD[T]HH:mm:ss.SSS';

module.exports.formatDateTimeToISO = function(date) {
	return !_.isUndefined(date) ? moment(date).utcOffset(0, false).format(ISO_DATE_TIME_PATTERN) : null;
};

module.exports.formatToDisplay = function(date) {
	return !_.isUndefined(date) ? moment(date).utcOffset(0, false).format(DISPLAY_PATTERN) : null;
};

