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
//# sourceMappingURL=services.js.map