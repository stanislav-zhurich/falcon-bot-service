/**
 * Created by Stanislav_Zhurich on 9/6/2017.
 */
module.exports.localizeValue = function(session, entry) {
	return session.localizer.gettext(session.preferredLocale(), entry);
}
