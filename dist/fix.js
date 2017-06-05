"use strict";
exports.__esModule = true;
var services_1 = require("./services");
////////////////////////
function import_h(raw) {
    var account = raw.account, raw_date = raw.date, raw_amount = raw.amount, raw_amounts = raw.amounts;
    if (raw_amount && raw_amounts)
        throw new Error("A fix can't have amount and amounts");
    var amounts = [];
    if (raw_amount)
        amounts.push(services_1.parse_raw_amount(raw_amount));
    if (raw_amounts)
        raw_amounts.forEach(function (ra) { return amounts.push(services_1.parse_raw_amount(ra)); });
    return {
        account: account,
        date: services_1.parse_raw_date(raw_date),
        amounts: amounts
    };
}
exports.import_h = import_h;
////////////////////////
function to_depth_0(fix) {
    var account = fix.account, date = fix.date, amounts = fix.amounts;
    return {
        account: account,
        date: date,
        amount: services_1.amounts_to_string(amounts)
    };
}
exports.to_depth_0 = to_depth_0;
//# sourceMappingURL=fix.js.map