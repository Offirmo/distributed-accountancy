import Wallet from 'walletjs'

import { Piggy, PiggyState } from './types'

////////////////////////

function state_factory(): PiggyState {
	return {
		content: Wallet.init(),
		expected_content: Wallet.init(),
	}
}

function import_h(raw: any): Piggy {
	const { name } = raw

	return {
		name,

		state: state_factory(),
}
}

////////////////////////

export {
	import_h,
}
