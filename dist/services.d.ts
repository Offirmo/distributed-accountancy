import { Amount, DateISO8601 } from './types';
declare function parse_raw_amount(raw: string | number): Amount;
declare function parse_raw_date(raw: string): DateISO8601;
export { parse_raw_amount, parse_raw_date };
