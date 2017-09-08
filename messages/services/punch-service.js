const AbstractService = require('./abstract-service'),
	serviceUtils = require('./service-utils')
	_ = require('lodash');

class PunchService extends AbstractService {

	findPunches(startDate, endDate, timeFrame, personNumber, authCookies) {
		let body = {
			employees: [
				{
					qualifier: personNumber
				}
			],
			timeframe_id: timeFrame
		};
		if(!_.isUndefined(startDate) && !_.isUndefined(endDate)){
			body.startDate = serviceUtils.formatDateTimeToISO(startDate);
			body.endDate = serviceUtils.formatDateTimeToISO(endDate);
		}
		return super._callPost(authCookies, body, 'timekeeping/v1/punches/multi_read')
			.then(response => {
				let punches = JSON.parse(response);
				if(_.isArray(punches)) {
					punches = _.map(punches, (punch) => {
						return {
							punchDateTime: serviceUtils.formatToDisplay(punch.punchDtm),
							enteredOnDateTime: serviceUtils.formatToDisplay(punch.enteredOnDtm),
							name: punch.typeOverride.name
						}
					})
				}
				return punches;
			})
	}
}

module.exports = PunchService;