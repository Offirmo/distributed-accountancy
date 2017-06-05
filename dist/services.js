"use strict";
exports.__esModule = true;
var lodash_1 = require("lodash");
var DEFAULT_CURRENCY = 'EUR';
function parse_raw_amount(raw) {
    var res = {
        amount: lodash_1.isNumber(raw) ? raw : 0,
        currency: DEFAULT_CURRENCY
    };
    if (lodash_1.isNumber(raw))
        return res;
    var step0 = raw;
    var step1 = step0.split(' ').join('');
    var step2 = step1.replace(',', '.');
    var step3 = step2;
    if (step2.endsWith('€')) {
        step3 = step2.slice(0, -1);
    }
    if (step2.endsWith('EUR')) {
        step3 = step2.slice(0, -3);
    }
    if (step2.startsWith('A$')) {
        step3 = step2.slice(2);
        res.currency = 'AUD';
    }
    if (step2.startsWith('S$')) {
        step3 = step2.slice(2);
        res.currency = 'SGD';
    }
    res.amount = Number(step3);
    if (isNaN(res.amount)) {
        console.error("Unable to parse amount \"" + step0 + "\" !", { step0: step0, step1: step1, step2: step2, step3: step3 });
        throw new Error("Unable to parse amount \"" + step0 + "\" !");
    }
    return res;
}
exports.parse_raw_amount = parse_raw_amount;
function parse_raw_date(raw) {
    var step0 = raw;
    var step1 = step0.split(' ').join('');
    var step2 = step1.replace('/', '-');
    var step3 = step2;
    switch (step2.length) {
        case 8:
            step3 = step2.slice(0, 3) + '-' + step2.slice(4, 5) + '-' + step2.slice(6, 7);
            break;
        case 10:
            //ok
            break;
        default:
            throw new Error("Unable to parse date \"" + step0 + "\" !");
    }
    var _a = step3.split('-'), y = _a[0], m = _a[1], d = _a[2];
    if (y.length !== 4
        || m.length !== 2
        || d.length !== 2
        || isNaN(Number(y))
        || Number(y) > 2100 || Number(y) < 1981
        || isNaN(Number(m))
        || Number(m) > 12 || Number(m) < 0
        || isNaN(Number(d))
        || Number(d) > 31 || Number(d) < 0) {
        console.error("Unable to parse date \"" + step0 + "\" !", { step0: step0, step1: step1, step2: step2, step3: step3 });
        throw new Error("Unable to parse date \"" + step0 + "\" !");
    }
    return step3;
}
exports.parse_raw_date = parse_raw_date;
function amount_to_string(a) {
    var amount = a.amount, currency = a.currency;
    return amount + " " + currency;
}
exports.amount_to_string = amount_to_string;
var ALLOWED_CURRENCIES_ORDERED = ['EUR', 'AUD', 'SGD'];
exports.ALLOWED_CURRENCIES_ORDERED = ALLOWED_CURRENCIES_ORDERED;
var MAX_LEFT_PAD = '          ';
function amounts_to_string(aa) {
    var by_currency = {};
    aa.forEach(function (a) { return by_currency[a.currency] = a; });
    var res = '';
    ALLOWED_CURRENCIES_ORDERED.forEach(function (c) {
        var s = by_currency.hasOwnProperty(c)
            ? (MAX_LEFT_PAD + by_currency[c].amount + ' ' + c).slice(-17)
            : MAX_LEFT_PAD + '       ';
        res += s;
    });
    return res;
}
exports.amounts_to_string = amounts_to_string;
//# sourceMappingURL=services.js.map