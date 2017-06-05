import { DB } from './types'

////////////////////////

function factory(): DB {
	return {
		users: {
			all: [],
			by_name: {},
		},
		piggies: {
			all: [],
			by_name: {},
		},
		accounts: {
			all: [],
			by_name: {},
			by_alias: {},
		},
		trades: {
			all: [],
		},
		tags: {
			all: [],
		},
		fixes: {
			all: [],
			by_account_name: {},
			latest_by_account_name: {},
		},
	}
}

////////////////////////

export {
	factory
}
