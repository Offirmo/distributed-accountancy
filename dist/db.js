"use strict";
exports.__esModule = true;
////////////////////////
function factory() {
    return {
        users: {
            all: [],
            by_name: {}
        },
        piggies: {
            all: [],
            by_name: {}
        },
        accounts: {
            all: [],
            by_name: {},
            by_alias: {}
        },
        trades: {
            all: []
        },
        tags: {
            all: []
        },
        fixes: {
            all: [],
            by_account_name: {}
        }
    };
}
exports.factory = factory;
//# sourceMappingURL=db.js.map