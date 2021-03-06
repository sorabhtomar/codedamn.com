import User from 'models/user'

function checkAuth(req) {
	if(!(req.session && req.session.auth)) {
		throw new Error('Unauthorized')
	}
}

const resolvers = {
	async selfRank(_, req) {
		checkAuth(req)

		const selfRank = await User.getUserRank(req.session.user.username)

		return selfRank
	},
	async rankings(_, req) {
		// checkAuth(req)
		const data = await User.getDamnList()
		return data
	}
}

const queries = `
selfRank: Int!
rankings: [UserRank!]!
`

const exportObject = {
	queries,
	resolvers
}

export default exportObject