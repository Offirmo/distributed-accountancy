#!/bin/sh
"use strict";
':'; //# http://sambal.org/?p=1014 ; exec `dirname $0`/node_modules/.bin/ts-node "$0" "$@"
exports.__esModule = true;
var fs = require("fs");
var hjson = require("hjson");
var hanson = require("hanson");
var prettifyJson = require("@offirmo/cli-toolbox/string/prettify-json");
var boxify = require("@offirmo/cli-toolbox/string/boxify");
var arrayify = require("@offirmo/cli-toolbox/string/arrayify");
var logSymbols = require("@offirmo/cli-toolbox/string/log-symbols");
var _1 = require(".");
var clearCli = require("@offirmo/cli-toolbox/stdout/clear-cli");
/////////////////////////////////////////////////
function load_human_json(path) {
    var text = fs.readFileSync(path, { encoding: 'utf-8' });
    try {
        return path.endsWith('.hjson')
            ? hjson.parse(text)
            : hanson.parse(text);
    }
    catch (err) {
        console.error(logSymbols.error + " error reading '" + path + "':\n  " + err.message);
        throw err;
    }
}
/////////////////////////////////////////////////
clearCli();
console.log(boxify('💰Offirmo‘s Distributed Accountancy💰 '));
//////////// 1. load data
var DATA_DIRECTORY = './demo/set01';
var raw_users = load_human_json(DATA_DIRECTORY + '/users.hanson');
var raw_accounts = load_human_json(DATA_DIRECTORY + '/accounts.hanson');
var raw_piggies = load_human_json(DATA_DIRECTORY + '/piggies.hjson');
var raw_fixes = load_human_json(DATA_DIRECTORY + '/2017/fixes.hanson');
var raw_trades = load_human_json(DATA_DIRECTORY + '/2017/trades_EIRL.hjson');
function get_default_ByOptions() {
    return {
        aliases: false,
        debug_id: '',
        recouncile_fn: function () { return undefined; }
    };
}
function unique_by_index(index_key, list, someOptions) {
    if (someOptions === void 0) { someOptions = {}; }
    var res = {};
    var options = Object.assign({}, get_default_ByOptions(), someOptions);
    function insert_unique(key, value, lineno) {
        if (typeof key === 'undefined')
            throw new Error("unique_by_index(" + index_key + ", " + options.debug_id + "): wrong key \"" + key + "\" on elem #" + lineno + "!");
        if (res.hasOwnProperty(key)) {
            value = options.recouncile_fn(res[key], value);
            if (!value)
                throw new Error("unique_by_index(" + index_key + ", " + options.debug_id + "): duplicate key \"" + key + "\" on elem #" + lineno + "!");
        }
        res[key] = value;
    }
    try {
        list.forEach(function (elem, i) {
            var key = elem[index_key];
            insert_unique(key, elem, i);
            if (options.aliases && elem.hasOwnProperty('aliases'))
                elem['aliases'].forEach(function (alias) { return insert_unique(alias, elem, i); });
        });
    }
    catch (err) {
        console.error(logSymbols.error + " error unique_by_index(" + index_key + ", " + options.debug_id + ")", err.message);
        throw err;
    }
    return res;
}
function many_by_index(index_key, list, someOptions) {
    if (someOptions === void 0) { someOptions = {}; }
    var res = {};
    var options = Object.assign({}, get_default_ByOptions(), someOptions);
    function insert(key, value, lineno) {
        if (typeof key === 'undefined') {
            var e = new Error("many_by_index(" + index_key + ", " + options.debug_id + "): wrong key \"" + key + "\" on elem #" + lineno + "!");
            e.lineno = lineno;
            throw e;
        }
        if (res.hasOwnProperty(key))
            res[key].push(value);
        else
            res[key] = [value];
    }
    try {
        list.forEach(function (elem, i) {
            var key = elem[index_key];
            insert(key, elem, i);
        });
    }
    catch (err) {
        console.error(logSymbols.error + " error many_by_index(" + index_key + ", " + options.debug_id + ")", err.message);
        if (err.hasOwnProperty('lineno')) {
            console.error("  line #" + err.lineno + ": " + prettifyJson(list[err.lineno]));
        }
        throw err;
    }
    return res;
}
var db = _1.db_factory();
db.users.all = raw_users.map(_1.import_user);
db.users.by_name = unique_by_index('name', db.users.all, { debug_id: 'user' });
db.accounts.all = raw_accounts.map(_1.import_account);
db.accounts.by_name = unique_by_index('name', db.accounts.all, { debug_id: 'account' });
db.accounts.by_alias = unique_by_index('name', db.accounts.all, { aliases: true, debug_id: 'account' });
var uniformized_raw_fixes = raw_fixes.map(function uniformize_account_name(rf, i) {
    var account_name = rf.account;
    if (!db.accounts.by_alias.hasOwnProperty(account_name))
        throw new Error(logSymbols.error + " error: unrecognized account name/alias \"" + account_name + "\"! (fix #" + i + ")");
    var canonical_account_name = db.accounts.by_alias[account_name].name;
    rf.account = canonical_account_name;
    return rf;
});
db.fixes.all = uniformized_raw_fixes.map(_1.import_fix);
db.fixes.latest_by_account_name = unique_by_index('account', db.fixes.all, {
    debug_id: 'fix',
    recouncile_fn: function (v1, v2) { return v1.date.localeCompare(v2.date) < 0 ? v2 : v1; }
});
db.fixes.by_account_name = many_by_index('account', db.fixes.all, { debug_id: 'fix' });
db.piggies.all = raw_piggies.map(_1.import_piggy);
db.trades.all = raw_trades.map(_1.import_trade);
//////////// 3. process
//////////// 4. display
//console.log(`${logSymbols.success} Users:`, columnify(Object.keys(db.users.by_name)))
console.log(logSymbols.success + " Users:\n" + prettifyJson(Object.keys(db.users.by_name)));
console.log(logSymbols.success + " Accounts:\n" + prettifyJson(Object.keys(db.accounts.by_name)));
//console.log(prettifyJson(db))
console.log(arrayify(db.fixes.all.map(_1.fix_to_depth_0)));
/*
db.accounts.forEach(account => {
    console.log(account.name)
    console.log(account.state.content.getAmount('EUR'), '€')
})
*/
//# sourceMappingURL=runme.js.map