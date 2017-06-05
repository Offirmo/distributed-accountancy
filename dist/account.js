"use strict";
exports.__esModule = true;
var walletjs_1 = require("walletjs");
////////////////////////
function state_factory() {
    return {
        content: walletjs_1["default"].init()
    };
}
exports.state_factory = state_factory;
function import_h(raw) {
    var name = raw.name, piggy = raw.piggy, autofix = raw.autofix, aliases = raw.aliases;
    return {
        name: name,
        piggy: piggy,
        autofix: !!autofix,
        aliases: aliases || [],
        state: state_factory()
    };
}
exports.import_h = import_h;
//# sourceMappingURL=account.js.map