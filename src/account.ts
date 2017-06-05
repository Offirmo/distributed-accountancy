import Wallet, { Money } from 'walletjs'

import { AccountState, Account } from './types'

////////////////////////

function state_factory(): AccountState {
	return {
		content: Wallet.init()
	}
}

function import_h(raw: any): Account {
	const { name, piggy, autofix, aliases } = raw

	return {
		name,
		piggy,
		autofix: !!autofix,
		aliases: aliases || [],

		state: state_factory(),
	}
}

/*
function default_sort(arr: Account[]): Account[] {

}
*/

////////////////////////

export {
	state_factory,
	import_h,
}
