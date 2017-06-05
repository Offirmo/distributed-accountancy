import { isUndefined } from 'lodash'

import { Trade, TradeDirection } from './types'
import { parse_raw_amount } from './services'

////////////////////////


function import_h(raw: any, debug_id?: string): Trade {
	let {
		name,
		amount: raw_amount,
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
		let { amount: a, currency: c } = parse_raw_amount(raw_amount)
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
