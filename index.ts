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
	import_account,
	import_fix,
	import_piggy,
	import_trade,
	import_user,
} from './src'

import * as clearCli from '@offirmo/cli-toolbox/stdout/clear-cli'
clearCli()


const DATA_DIRECTORY = './demo/set01'

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

console.log(boxify('💰Offirmo‘s Distributed Accountancy💰 '))


const db = db_factory()

const raw_accounts = load_human_json(DATA_DIRECTORY + '/accounts.hanson')
db.accounts = raw_accounts.map(import_account)

const raw_fixes = load_human_json(DATA_DIRECTORY + '/2017/fixes.hanson')
db.fixes = raw_fixes.map(import_fix)

const raw_piggies = load_human_json(DATA_DIRECTORY + '/piggies.hjson')
db.piggies = raw_piggies.map(import_piggy)

const raw_trades = load_human_json(DATA_DIRECTORY + '/2017/trades_EIRL.hjson')
db.trades = raw_trades.map(import_trade)

const raw_users = load_human_json(DATA_DIRECTORY + '/users.hanson')
db.users = raw_users.map(import_user)

const rules = [

]

console.log(`${logSymbols.success} Users:`, columnify(db.users.map(u => u.name)))

//console.log(prettifyJson(db))

console.log(arrayify(db.accounts))

/*
db.accounts.forEach(account => {
	console.log(account.name)
	console.log(account.state.content.getAmount('EUR'), '€')
})
*/
