import { Piggy } from './types'

////////////////////////

function import_h(raw: any): Piggy {
	const { name } = raw

	return { name }
}

////////////////////////

export {
	import_h,
}
