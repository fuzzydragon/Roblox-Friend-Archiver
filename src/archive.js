const { fetchIdForName, fetchFriendsForId } = require(`./roblox`)
const { writeFileSync, appendFileSync, mkdirSync, existsSync } = require(`fs`)

async function sleep(timeout) {
	return new Promise(resolve => setTimeout(resolve, timeout))
}

async function archive(flags) {
	const user = flags["-u"] || flags["--user"]
	const id = flags["-i"] || flags["--id"] || (await fetchIdForName(user))
	const friends = await fetchFriendsForId(id)

	const dir = `./` + id

	if (!existsSync(dir)) {
		mkdirSync(dir)
		mkdirSync(dir + `/friends`)
		writeFileSync(dir + `/stats.csv`, `count,friends`)
	}

	appendFileSync(dir + `/stats.csv`, `\n` + friends.length + `,` + friends.map(f => f.id).join(`;`))

	for (const friend of friends) {
		const fid = friend.id
		const fdir = dir + `/friends/` + fid + `.csv`

		if (!existsSync(fdir)) {
			writeFileSync(fdir, `count,friends`)
		}
		
		let ffriends = await fetchFriendsForId(fid)

		while (ffriends == null) {
			console.log(`code: 👻`)
			await sleep(60000)
			ffriends = await fetchFriendsForId(fid)
		}

		appendFileSync(fdir, `\n` + ffriends.length + `,` + ffriends.map(f => f.id).join(`;`))

		await sleep(500)
	}
}

function parse(argv) {
	const args = {}
 
	for (let i = 2; i < argv.length; i += 2) {
		args[argv[i]] = argv[i + 1]
	}

	return args
}

const args = parse(process.argv)

archive(args)
	.then(() => console.log(`== [ DONE ] ==`)) 