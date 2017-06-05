"use strict";
exports.__esModule = true;
var lodash_1 = require("lodash");
var types_1 = require("./types");
var services_1 = require("./services");
////////////////////////
function import_h(raw, debug_id) {
    var name = raw.name, raw_amount = raw.amount, direction = raw.direction, deal_date = raw.deal_date, effective_date = raw.effective_date, src = raw.src, dest = raw.dest, tags = raw.tags, notes = raw.notes, isRaw = raw.raw;
    if (!raw_amount)
        throw new Error("Unable to parse trade #" + debug_id + " (\"" + name + "\"): no amount !");
    var amount;
    var currency;
    direction = direction || types_1.TradeDirection.output;
    notes = notes || '';
    isRaw = lodash_1.isUndefined(isRaw) ? false : !!isRaw;
    try {
        var _a = services_1.parse_raw_amount(raw_amount), a = _a.amount, c = _a.currency;
        amount = a;
        currency = c;
    }
    catch (e) {
        console.error("Failed to import trade #" + debug_id + " (\"" + name + "\") !");
        throw e;
    }
    return {
        name: name,
        amount: amount,
        currency: currency,
        direction: direction,
        deal_date: deal_date,
        effective_date: effective_date,
        src: src,
        dest: dest,
        tags: tags,
        notes: notes,
        raw: isRaw
    };
}
exports.import_h = import_h;
//# sourceMappingURL=trade.js.map