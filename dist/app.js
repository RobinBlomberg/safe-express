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
var _SafeApp_api, _SafeApp_app;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeApp = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const _1 = require(".");
const logger_1 = require("./logger");
class SafeApp {
    constructor(options) {
        _SafeApp_api.set(this, void 0);
        _SafeApp_app.set(this, void 0);
        __classPrivateFieldSet(this, _SafeApp_api, options.api, "f");
        __classPrivateFieldSet(this, _SafeApp_app, (0, express_1.default)(), "f");
        if (options.log) {
            __classPrivateFieldGet(this, _SafeApp_app, "f").use((0, logger_1.logger)(typeof options.log === 'boolean' ? undefined : options.log));
        }
        __classPrivateFieldGet(this, _SafeApp_app, "f").use(express_1.default.json());
        __classPrivateFieldGet(this, _SafeApp_app, "f").use(express_1.default.urlencoded({ extended: true }));
        __classPrivateFieldGet(this, _SafeApp_app, "f").use((0, cookie_parser_1.default)());
        __classPrivateFieldGet(this, _SafeApp_app, "f").use((0, cors_1.default)(options.cors));
    }
    createRouter(path) {
        return new _1.SafeRouter(__classPrivateFieldGet(this, _SafeApp_api, "f"), path);
    }
    listen(port) {
        __classPrivateFieldGet(this, _SafeApp_app, "f").listen(port);
        return this;
    }
    useErrorRequestHandler(errorRequestHandler) {
        const handler = (error, request, response, next) => {
            return errorRequestHandler({
                error,
                next,
                request,
                response,
            });
        };
        __classPrivateFieldGet(this, _SafeApp_app, "f").use(handler);
        return this;
    }
    useRequestHandler(requestHandler) {
        const handler = (request, response, next) => {
            return requestHandler({
                api: __classPrivateFieldGet(this, _SafeApp_api, "f"),
                next,
                request,
                response,
            });
        };
        __classPrivateFieldGet(this, _SafeApp_app, "f").use(handler);
        return this;
    }
    useRouter(router) {
        __classPrivateFieldGet(this, _SafeApp_app, "f").use(router.path, router.router);
        return this;
    }
}
exports.SafeApp = SafeApp;
_SafeApp_api = new WeakMap(), _SafeApp_app = new WeakMap();
//# sourceMappingURL=app.js.map