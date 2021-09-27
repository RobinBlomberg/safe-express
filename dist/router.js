"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _SafeRouter_instances, _SafeRouter_on;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeRouter = void 0;
const http_status_1 = require("@robinblomberg/http-status");
const express_1 = __importDefault(require("express"));
const _1 = require(".");
class SafeRouter {
    constructor(api, options = {}) {
        var _a;
        _SafeRouter_instances.add(this);
        this.api = api;
        this.middleware = (_a = options.middleware) !== null && _a !== void 0 ? _a : [];
        this.router = express_1.default.Router();
    }
    delete(path, ...args) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'delete', path, args);
    }
    get(path, ...args) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'get', path, args);
    }
    head(path, ...args) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'head', path, args);
    }
    options(path, ...args) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'options', path, args);
    }
    patch(path, ...args) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'patch', path, args);
    }
    post(path, ...args) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'post', path, args);
    }
    put(path, ...args) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'put', path, args);
    }
}
exports.SafeRouter = SafeRouter;
_SafeRouter_instances = new WeakSet(), _SafeRouter_on = function _SafeRouter_on(method, path, args) {
    var _a;
    const middleware = args[1] ? args[0] : [];
    const requestHandler = (_a = args[1]) !== null && _a !== void 0 ? _a : args[0];
    this.router[method](path, (originalReq, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _b, _c;
        const schema = (_c = (_b = this.api[path]) === null || _b === void 0 ? void 0 : _b[method]) === null || _c === void 0 ? void 0 : _c.requestBody;
        if (schema) {
            const result = schema.safeParse(originalReq.body);
            if (!result.success) {
                res.status(http_status_1.status.clientError.BAD_REQUEST);
                res.json(result.error.errors);
                return;
            }
        }
        const req = originalReq;
        req.data = {};
        try {
            const handlers = [...this.middleware, ...middleware, requestHandler];
            let responseBody;
            for (const handler of handlers) {
                // eslint-disable-next-line no-await-in-loop
                responseBody = yield Promise.resolve(handler(req, res, next));
            }
            res.json(responseBody !== null && responseBody !== void 0 ? responseBody : null);
        }
        catch (error) {
            if (error instanceof _1.RequestError) {
                res.status(error.status);
                res.json({
                    code: error.code,
                });
            }
            else if (error instanceof SyntaxError &&
                error.type === 'entity.parse.failed') {
                res.status(http_status_1.status.clientError.BAD_REQUEST);
                res.json('Expected request body to be an object or array.');
            }
            else {
                console.error(error);
                res.status(http_status_1.status.serverError.INTERNAL_SERVER_ERROR);
                res.json(http_status_1.statusText[http_status_1.status.serverError.INTERNAL_SERVER_ERROR]);
            }
        }
    }));
};
//# sourceMappingURL=router.js.map