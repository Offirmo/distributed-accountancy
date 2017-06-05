import { Fix } from './types'

////////////////////////

function import_h(raw: any): Fix {
	const { date, amount, currency } = raw

	return { date, amount, currency }
}

////////////////////////

export {
	import_h,
}
