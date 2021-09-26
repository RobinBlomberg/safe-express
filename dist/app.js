"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _SafeApp_app;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeApp = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const logger_1 = require("./internal/logger");
class SafeApp {
    constructor(options) {
        _SafeApp_app.set(this, void 0);
        __classPrivateFieldSet(this, _SafeApp_app, (0, express_1.default)(), "f");
        if (options.log) {
            this.useMiddleware((0, logger_1.logger)(typeof options.log === 'boolean' ? undefined : options.log));
        }
        this.useMiddleware(express_1.default.json());
        this.useMiddleware(express_1.default.urlencoded({ extended: true }));
        this.useMiddleware((0, cookie_parser_1.default)());
        this.useMiddleware((0, cors_1.default)(options.cors));
    }
    listen(port, callback) {
        __classPrivateFieldGet(this, _SafeApp_app, "f").listen(port);
        callback === null || callback === void 0 ? void 0 : callback();
        return this;
    }
    useErrorRequestHandler(errorRequestHandler) {
        __classPrivateFieldGet(this, _SafeApp_app, "f").use(errorRequestHandler);
        return this;
    }
    useMiddleware(requestHandler) {
        __classPrivateFieldGet(this, _SafeApp_app, "f").use(requestHandler);
        return this;
    }
    useRouter(path, router) {
        __classPrivateFieldGet(this, _SafeApp_app, "f").use(path, router.router);
        return this;
    }
}
exports.SafeApp = SafeApp;
_SafeApp_app = new WeakMap();
//# sourceMappingURL=app.js.map