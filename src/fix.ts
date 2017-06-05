import { Amount, Fix } from './types'
import { parse_raw_amount } from './services'

////////////////////////

function import_h(raw: any): Fix {
	const { account, date, amount: raw_amount, amounts: raw_amounts } = raw

	if (raw_amount && raw_amounts)
		throw new Error(`A fix can't have amount and amounts`)

	let amounts: Amount[] = []
	if (raw_amount)
		amounts.push(parse_raw_amount(raw_amount))
	if (raw_amounts)
		raw_amounts.forEach(ra => amounts.push(parse_raw_amount(ra)))
	return {
		account,
		date,
		amounts,
	}
}

////////////////////////

export {
	import_h,
}
