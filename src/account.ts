import Wallet, { Money } from 'walletjs'

import { AccountState, Account } from './types'

////////////////////////

function state_factory(): AccountState {
	return {
		content: Wallet.init()
	}
}

function import_h(raw: any): Account {
	const { name, piggy, autofix } = raw

	return {
		name,
		piggy,
		autofix: !!autofix,

		state: state_factory(),
	}
}


////////////////////////

export {
	import_h,
}
