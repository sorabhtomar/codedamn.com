import * as xdebug from 'debug'

/**
 * 
 * @param req express req
 * @param res express res
 * @param next calling next middleware
 * @summary allows access to API resources only if user is logged in
 * @returns next() or { status: 'error' }
 */
function loggedIn(req, res, next) {
	debugger
	if(!req.session.auth) {
		return res.json({ status: 'error', data: 'unauthorized' })
	}
	next()
}

export default loggedIn