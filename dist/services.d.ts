import { Amount, DateISO8601 } from './types';
declare function parse_raw_amount(raw: string | number): Amount;
declare function parse_raw_date(raw: string): DateISO8601;
declare function amount_to_string(a: Amount): string;
declare const ALLOWED_CURRENCIES_ORDERED: string[];
declare function amounts_to_string(aa: Amount[]): string;
export { parse_raw_amount, parse_raw_date, ALLOWED_CURRENCIES_ORDERED, amount_to_string, amounts_to_string };
