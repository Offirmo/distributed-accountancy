import { isNumber, isUndefined } from 'lodash'

import { Trade, TradeDirection } from './types'

////////////////////////

function parse_raw_amount(raw: string | number, currency_hint: string = 'EUR'): { amount: number, currency: string } {
	let original = raw
	let amount = 0
	let currency = currency_hint

	if (isNumber(raw))
		return { amount: raw, currency }

	raw = raw.trim()
	if (raw.endsWith('€')) {
		raw = raw.slice(0, -1).trim()
		currency = 'EUR'
	}

	amount = Number(raw)
	if (isNaN(amount))
		throw new Error(`Unable to parse amount "${original}" !`)

	return { amount, currency }
}

function import_h(raw: any, debug_id?: string): Trade {
	let {
		name,
		amount: raw_amount,
		currency: explicit_currency,
		direction,
		deal_date,
		effective_date,
		src,
		dest,
		tags,
		notes,
		raw: isRaw,
	} = raw

	if (!raw_amount)
		throw new Error(`Unable to parse trade #${debug_id} ("${name}"): no amount !`)

	let amount: number
	let currency: string

	direction = direction || TradeDirection.output
	notes = notes || ''
	isRaw = isUndefined(isRaw) ? false : !!isRaw

	try {
		let { amount: a, currency: c } = parse_raw_amount(raw_amount, explicit_currency)
		amount = a
		currency = c
	}
	catch (e) {
		console.error(`Failed to import trade #${debug_id} ("${name}") !`)
		throw e
	}

	return {
		name,
		amount,
		currency,
		direction,
		deal_date,
		effective_date,
		src,
		dest,
		tags,
		notes,
		raw: isRaw,
	}
}

////////////////////////

export {
	import_h,
}
