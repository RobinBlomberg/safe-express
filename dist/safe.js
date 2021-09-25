"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safe = void 0;
const _1 = require(".");
exports.safe = {
    createApp: (options) => {
        return new _1.SafeApp(options);
    },
    createRouter: (api, path) => {
        return new _1.SafeRouter(api, path);
    },
};
//# sourceMappingURL=safe.js.map