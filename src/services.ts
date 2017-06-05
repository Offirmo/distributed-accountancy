import { isNumber } from 'lodash'

import { Amount } from './types'

const DEFAULT_CURRENCY = 'EUR'

function parse_raw_amount(raw: string|number): Amount {
	const res: Amount = {
		amount: isNumber(raw) ? raw : 0,
		currency: DEFAULT_CURRENCY
	}
	if (isNumber(raw)) return res

	const step0 = raw
	const step1 = step0.split(' ').join('')
	const step2 = step1.replace(',', '.')
	let step3 = step2
	if (step2.endsWith('€')) {
		step3 = step2.slice(0, -1)
	}
	if (step2.endsWith('EUR')) {
		step3 = step2.slice(0, -3)
	}
	if (step2.startsWith('A$')) {
		step3 = step2.slice(2)
		res.currency = 'AUD'
	}
	if (step2.startsWith('S$')) {
		step3 = step2.slice(2)
		res.currency = 'SGD'
	}

	res.amount = Number(step3)
	if (isNaN(res.amount)) {
		console.error(`Unable to parse amount "${step0}" !`, { step0, step1, step2, step3 })
		throw new Error(`Unable to parse amount "${step0}" !`)
	}

	return res
}

export {
	parse_raw_amount
}
