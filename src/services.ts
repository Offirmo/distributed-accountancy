import { isNumber } from 'lodash'

import { Amount, DateISO8601 } from './types'

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

function parse_raw_date(raw: string): DateISO8601 {
	const step0 = raw
	const step1 = step0.split(' ').join('')
	const step2 = step1.replace('/', '-')
	let step3 = step2
	switch(step2.length) {
		case 8:
			step3 = step2.slice(0, 3) + '-' + step2.slice(4, 5) + '-' +step2.slice(6, 7)
			break
		case 10:
			//ok
			break
		default:
			throw new Error(`Unable to parse date "${step0}" !`)
	}

	const [y, m, d] = step3.split('-')
	if (y.length !== 4
		|| m.length !== 2
		|| d.length !== 2
		|| isNaN(Number(y))
		|| Number(y) > 2100 || Number(y) < 1981
		|| isNaN(Number(m))
		|| Number(m) > 12 || Number(m) < 0
		|| isNaN(Number(d))
		|| Number(d) > 31 || Number(d) < 0
	) {
		console.error(`Unable to parse date "${step0}" !`, {step0, step1, step2, step3})
		throw new Error(`Unable to parse date "${step0}" !`)
	}

	return step3
}

function amount_to_string(a: Amount): string {
	const { amount, currency } = a
	return `${amount} ${currency}`
}

const ALLOWED_CURRENCIES_ORDERED = [ 'EUR', 'AUD', 'SGD' ]
const LEFT_PAD_HELP = '                             '
function amounts_to_string(aa: Amount[]): string {
	let by_currency = {}
	aa.forEach(a => by_currency[a.currency] = a)

	/*
	return '.' + ALLOWED_CURRENCIES_ORDERED.map(c => {
		let s = by_currency.hasOwnProperty(c)
			? (LEFT_PAD_HELP + by_currency[c].amount.toLocaleString({
				style: 'currency',
				useGrouping: true,
				currency: c,
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})).slice(-19)
			: LEFT_PAD_HELP.slice(-19)
		return s
	}).join(' ')
	*/

	return '.' + ALLOWED_CURRENCIES_ORDERED
		.map(
			c => by_currency.hasOwnProperty(c)
				? (LEFT_PAD_HELP + by_currency[c].amount.toFixed(2) + ' ' + c).slice(-18)
				: LEFT_PAD_HELP.slice(-18)
		)
		.join(' ')
}

export {
	parse_raw_amount,
	parse_raw_date,
	ALLOWED_CURRENCIES_ORDERED,
	amount_to_string,
	amounts_to_string,
}
