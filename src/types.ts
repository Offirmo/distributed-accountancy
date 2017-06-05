import { Enum } from "typescript-string-enums"

////////////////////////

type DateISO8601 = string
type Wallet = any

const TradeDirection = Enum(
	'input',
	'output',
	'internal',
)
type TradeDirection = Enum<typeof TradeDirection>


interface User {
	name: string
}


interface PiggyDef {
	name: string
}
interface PiggyState {
	content: Wallet
	expected_content: Wallet
}
interface Piggy extends PiggyDef {
	state: PiggyState
}


interface AccountDef {
	name: string
	piggy?: string
	autofix: boolean
}
interface AccountState {
	content: Wallet
}
interface Account extends AccountDef {
	state: AccountState
}

interface Fix {
	date: DateISO8601
	amount: number
	currency: string
}

interface Trade {
	name: string
	amount: number
	currency: string
	direction: TradeDirection
	deal_date?: DateISO8601
	effective_date?: DateISO8601
	src?: string
	dest?: string
	tags: string[]
	notes: string
	raw: boolean // means that this trade is not usable as is, only here for post-processings thanks to rules
					 // ex. an unpaid vacation = loss of revenue = theoritical revenues should be accounted in expected savings
}

interface DB {
	users: User[]
	piggies: Piggy[]
	accounts: Account[]
	trades: Trade[]
	tags: string[]
	fixes: Fix[]
}

////////////////////////

export {
	TradeDirection,
	User,
	Piggy,
	AccountState,
	Account,
	Fix,
	Trade,
	DB,
}
