const { request } = require(`https`)

const roblox = {}

roblox.fetchIdForName = async (name) => {
	return new Promise(resolve => {
		const req = request(`https://api.roblox.com/users/get-by-username?username=${name}`, resp => {
			let data = ``

			resp.on(`data`, c => data += c)
			resp.on(`end`, () => resolve(JSON.parse(data).Id))
		})

		req.end()
	})
}

const friendCache = {}

roblox.fetchFriendsForId = async (id) => {
	return friendCache[id] || new Promise((resolve, reject) => {
		const req = request(`https://friends.roblox.com/v1/users/${id}/friends`, resp => {
			let data = ``

			resp.on(`data`, c => data += c)
			resp.on(`end`, () => {
				console.log(id, resp.statusCode)
				friendCache[id] = JSON.parse(data).data

				resolve(friendCache[id])
			})
		})

		req.end()
	})
}

module.exports = roblox