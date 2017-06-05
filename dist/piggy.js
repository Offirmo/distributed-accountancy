"use strict";
exports.__esModule = true;
var walletjs_1 = require("walletjs");
////////////////////////
function state_factory() {
    return {
        content: walletjs_1["default"].init(),
        expected_content: walletjs_1["default"].init()
    };
}
function import_h(raw) {
    var name = raw.name;
    return {
        name: name,
        state: state_factory()
    };
}
exports.import_h = import_h;
//# sourceMappingURL=piggy.js.map