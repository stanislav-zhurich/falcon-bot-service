
const AbstractService = require('./abstract-service'),
	_ = require('lodash');

class PersonalityService extends AbstractService{
	/**
	 *
	 * @param name - user name
	 * @param authCookies - authentication cookies
	 * @returns Promise {
								"personNumber": "10050",
								"fullName": "Hudson, Linda",
								"personId": 17,
								"displayName": "Hudson, Linda (10050)",
								"name": "Hudson, Linda (10050)"
							}
	 */
	findUserByName(name, authCookies) {
		let body = {
			where: {
				employees: {
					key: 'username',
					values: [name]
				},
				onlyActivePerson: true
			}
		};
		return super._callPost(authCookies, body, 'v1/commons/persons/base_persons/multi_read')
			.then(response => {
				let persons = JSON.parse(response);
				if(_.isArray(persons) && persons.length > 0) {
					return persons[0];
				}
		})
	}
}

module.exports = PersonalityService;