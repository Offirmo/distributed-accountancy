import { Enum } from "typescript-string-enums";
import { Wallet } from 'walletjs';
declare type DateISO8601 = string;
declare const TradeDirection: {
    input: "input";
    output: "output";
    internal: "internal";
};
declare type TradeDirection = Enum<typeof TradeDirection>;
interface Amount {
    amount: number;
    currency: string;
}
interface User {
    name: string;
}
interface PiggyDef {
    name: string;
}
interface PiggyState {
    content: Wallet;
    expected_content: Wallet;
}
interface Piggy extends PiggyDef {
    state: PiggyState;
}
interface AccountDef {
    name: string;
    aliases: string[];
    piggy?: string;
    autofix: boolean;
}
interface AccountState {
    content: Wallet;
}
interface Account extends AccountDef {
    state: AccountState;
}
interface Fix {
    account: string;
    date: DateISO8601;
    amounts: Amount[];
}
interface Trade extends Amount {
    name: string;
    direction: TradeDirection;
    deal_date?: DateISO8601;
    effective_date?: DateISO8601;
    src?: string;
    dest?: string;
    tags: string[];
    notes: string;
    raw: boolean;
}
interface DB {
    users: {
        all: User[];
        by_name: {
            [name: string]: User;
        };
    };
    piggies: {
        all: Piggy[];
        by_name: {
            [name: string]: Piggy;
        };
    };
    accounts: {
        all: Account[];
        by_name: {
            [name: string]: Account;
        };
        by_alias: {
            [name: string]: Account;
        };
    };
    trades: {
        all: Trade[];
    };
    tags: {
        all: string[];
    };
    fixes: {
        all: Fix[];
        by_account_name: {
            [name: string]: Fix[];
        };
        latest_by_account_name: {
            [name: string]: Fix;
        };
    };
}
export { DateISO8601, TradeDirection, Amount, User, PiggyDef, PiggyState, Piggy, AccountDef, AccountState, Account, Fix, Trade, DB };
