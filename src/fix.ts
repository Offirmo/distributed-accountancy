import { Amount, Fix } from './types'
import { parse_raw_amount, parse_raw_date, amounts_to_string } from './services'

////////////////////////

function import_h(raw: any): Fix {
	const { account, date: raw_date, amount: raw_amount, amounts: raw_amounts } = raw

	if (raw_amount && raw_amounts)
		throw new Error(`A fix can't have amount and amounts`)

	let amounts: Amount[] = []
	if (raw_amount)
		amounts.push(parse_raw_amount(raw_amount))
	if (raw_amounts)
		raw_amounts.forEach(ra => amounts.push(parse_raw_amount(ra)))
	return {
		account,
		date: parse_raw_date(raw_date),
		amounts,
	}
}

////////////////////////

function to_depth_0(fix: Fix): any {
	const { account, date, amounts } = fix

	return {
		account,
		date,
		amount: amounts_to_string(amounts)
	}
}


////////////////////////

export {
	import_h,
	to_depth_0,
}
