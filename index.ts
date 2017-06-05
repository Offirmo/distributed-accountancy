#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec `dirname $0`/node_modules/.bin/ts-node "$0" "$@"

import * as fs from 'fs'

import * as hjson from 'hjson'

import {
	db_factory,
	import_account,
	import_fix,
	import_piggy,
	import_trade,
	import_user,
} from './src'

const DATA_DIRECTORY = './demo/set01'

const db = db_factory()

const raw_accounts = hjson.parse(fs.readFileSync(DATA_DIRECTORY + '/accounts.hjson', {encoding: 'utf-8'}))
db.accounts = raw_accounts.map(import_account)

const raw_fixes = hjson.parse(fs.readFileSync(DATA_DIRECTORY + '/fixes.hjson', {encoding: 'utf-8'}))
db.fixes = raw_fixes.map(import_fix)

const raw_piggies = hjson.parse(fs.readFileSync(DATA_DIRECTORY + '/piggies.hjson', {encoding: 'utf-8'}))
db.piggies = raw_piggies.map(import_piggy)

const raw_trades = hjson.parse(fs.readFileSync(DATA_DIRECTORY + '/2017/trades_EIRL.hjson', {encoding: 'utf-8'}))
db.trades = raw_trades.map(import_trade)

const raw_users = hjson.parse(fs.readFileSync(DATA_DIRECTORY + '/users.hjson', {encoding: 'utf-8'}))
db.users = raw_users.map(import_user)

const rules = [

]


console.log(db)

db.accounts.forEach(account => {
	console.log(account.name)
	console.log(account.state.content.getAmount('EUR'), '€')
})
