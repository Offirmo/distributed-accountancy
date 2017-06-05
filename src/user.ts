import { User } from './types'

////////////////////////

function import_h(raw: any): User {
	const { name } = raw

	return { name }
}

////////////////////////

export {
	import_h,
}
