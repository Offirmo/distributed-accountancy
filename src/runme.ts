#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec `dirname $0`/node_modules/.bin/ts-node "$0" "$@"

import * as fs from 'fs'

import * as hjson from 'hjson'
import * as hanson from 'hanson'
import * as prettifyJson from '@offirmo/cli-toolbox/string/prettify-json'
import * as boxify from '@offirmo/cli-toolbox/string/boxify'
import * as arrayify from '@offirmo/cli-toolbox/string/arrayify'
import * as columnify from '@offirmo/cli-toolbox/string/columnify'
import * as logSymbols from '@offirmo/cli-toolbox/string/log-symbols'

import {
	db_factory,
	User,
	import_user,
	Account,
	import_account,
	Fix,
	import_fix,
	fix_to_depth_0,
	import_piggy,
	import_trade,
} from '.'

import * as clearCli from '@offirmo/cli-toolbox/stdout/clear-cli'

/////////////////////////////////////////////////

function load_human_json(path): any {
	const text = fs.readFileSync(path, {encoding: 'utf-8'})
	try {
		return path.endsWith('.hjson')
			? hjson.parse(text)
			: hanson.parse(text)
	}
	catch (err) {
		console.error(`${logSymbols.error} error reading '${path}':\n  ${err.message}`)
		throw err
	}
}

/////////////////////////////////////////////////

clearCli()
console.log(boxify('💰Offirmo‘s Distributed Accountancy💰 '))

//////////// 1. load data

const DATA_DIRECTORY = './demo/set01'
const raw_users    = load_human_json(DATA_DIRECTORY + '/users.hanson')
const raw_accounts = load_human_json(DATA_DIRECTORY + '/accounts.hanson')
const raw_piggies  = load_human_json(DATA_DIRECTORY + '/piggies.hjson')
const raw_fixes    = load_human_json(DATA_DIRECTORY + '/2017/fixes.hanson')
const raw_trades   = load_human_json(DATA_DIRECTORY + '/2017/trades_EIRL.hjson')

//////////// 2. load into DB

interface ByOptions<T> {
	aliases: boolean
	debug_id: string
	recouncile_fn(v1: T, v2: T): T | undefined
}
function get_default_ByOptions<T>(): ByOptions<T> {
	return {
		aliases: false,
			debug_id: '',
		recouncile_fn: () => undefined
	}
}

function unique_by_index<T extends Object>(
	index_key: string,
	list: T[],
	someOptions: Partial<ByOptions<T>> = {}
): {[k: string]: T}
{
	const res: {[k: string]: T} = {}
	const options: ByOptions<T> = Object.assign({}, get_default_ByOptions<T>(), someOptions)

	function insert_unique(key: string, value: T, lineno: number) {
		if (typeof key === 'undefined')
			throw new Error(`unique_by_index(${index_key}, ${options.debug_id}): wrong key "${key}" on elem #${lineno}!`)
		if (res.hasOwnProperty(key)) {
			value = options.recouncile_fn(res[key], value)!
			if (!value)
				throw new Error(`unique_by_index(${index_key}, ${options.debug_id}): duplicate key "${key}" on elem #${lineno}!`)
		}
		res[key] = value!
	}

	try {
		list.forEach((elem, i) => {
			const key = elem[index_key]
			insert_unique(key, elem, i)
			if (options.aliases && elem.hasOwnProperty('aliases'))
				elem['aliases'].forEach(alias => insert_unique(alias, elem, i))
		})
	}
	catch( err ) {
		console.error(`${logSymbols.error} error unique_by_index(${index_key}, ${options.debug_id})`, err.message)
		throw err
	}
	return res
}

function many_by_index<T extends Object>(
	index_key: string,
	list: T[],
	someOptions: Partial<ByOptions<T>> = {}
): {[k: string]: T[]}
{
	const res: {[k: string]: T[]} = {}
	const options: ByOptions<T> = Object.assign({}, get_default_ByOptions<T>(), someOptions)

	function insert(key: string, value: T, lineno: number) {
		if (typeof key === 'undefined') {
			const e = new Error(`many_by_index(${index_key}, ${options.debug_id}): wrong key "${key}" on elem #${lineno}!`)
			;(e as any).lineno = lineno
			throw e
		}
		if (res.hasOwnProperty(key))
			res[key].push(value)
		else
			res[key] = [value]
	}

	try {
		list.forEach((elem, i) => {
			const key = elem[index_key]
			insert(key, elem, i)
		})
	}
	catch( err ) {
		console.error(`${logSymbols.error} error many_by_index(${index_key}, ${options.debug_id})`, err.message)
		if (err.hasOwnProperty('lineno')) {
			console.error(`  line #${err.lineno}: ${prettifyJson(list[err.lineno])}`)
		}
		throw err
	}
	return res
}


const db = db_factory()
db.users.all = raw_users.map(import_user)
db.users.by_name = unique_by_index<User>('name', db.users.all, {debug_id: 'user'})

db.accounts.all = raw_accounts.map(import_account)
db.accounts.by_name = unique_by_index<Account>('name', db.accounts.all, {debug_id: 'account'})
db.accounts.by_alias = unique_by_index<Account>('name', db.accounts.all, {aliases: true, debug_id: 'account'})

const uniformized_raw_fixes = raw_fixes.map(function uniformize_account_name(rf, i): any {
	const { account: account_name } = rf
	if (! db.accounts.by_alias.hasOwnProperty(account_name))
		throw new Error(`${logSymbols.error} error: unrecognized account name/alias "${account_name}"! (fix #${i})`)
	const canonical_account_name = db.accounts.by_alias[account_name].name
	rf.account = canonical_account_name
	return rf
})
db.fixes.all = uniformized_raw_fixes.map(import_fix)
db.fixes.latest_by_account_name = unique_by_index<Fix>('account', db.fixes.all, {
	debug_id: 'fix',
	recouncile_fn: (v1: Fix, v2: Fix) => v1.date.localeCompare(v2.date) < 0 ? v2 : v1
})
db.fixes.by_account_name = many_by_index<Fix>('account', db.fixes.all, {debug_id: 'fix'})

db.piggies.all = raw_piggies.map(import_piggy)
db.trades.all = raw_trades.map(import_trade)

//////////// 3. process

//////////// 4. display

//console.log(`${logSymbols.success} Users:`, columnify(Object.keys(db.users.by_name)))
console.log(`${logSymbols.success} Users:\n${prettifyJson(Object.keys(db.users.by_name))}`)
console.log(`${logSymbols.success} Accounts:\n${prettifyJson(Object.keys(db.accounts.by_name))}`)

//console.log(prettifyJson(db))

console.log(arrayify(Object.keys(db.fixes.latest_by_account_name).map(k => db.fixes.latest_by_account_name[k]).map(fix_to_depth_0)))

/*
db.accounts.forEach(account => {
	console.log(account.name)
	console.log(account.state.content.getAmount('EUR'), '€')
})
*/
