import { AccountState, Account } from './types';
declare function state_factory(): AccountState;
declare function import_h(raw: any): Account;
export { state_factory, import_h };
