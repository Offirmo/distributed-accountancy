import { DB } from './types'

////////////////////////

function factory(): DB {
	return {
		users: [],
		piggies: [],
		accounts: [],
		trades: [],
		tags: [],
		fixes: [],
	}
}

////////////////////////

export {
	factory
}
