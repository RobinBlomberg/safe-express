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
    constructor(api) {
        _SafeRouter_instances.add(this);
        this.api = api;
        this.router = express_1.default.Router();
    }
    delete(path, requestHandler) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'delete', path, requestHandler);
    }
    get(path, requestHandler) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'get', path, requestHandler);
    }
    head(path, requestHandler) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'head', path, requestHandler);
    }
    options(path, requestHandler) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'options', path, requestHandler);
    }
    patch(path, requestHandler) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'patch', path, requestHandler);
    }
    post(path, requestHandler) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'post', path, requestHandler);
    }
    put(path, requestHandler) {
        __classPrivateFieldGet(this, _SafeRouter_instances, "m", _SafeRouter_on).call(this, 'put', path, requestHandler);
    }
}
exports.SafeRouter = SafeRouter;
_SafeRouter_instances = new WeakSet(), _SafeRouter_on = function _SafeRouter_on(method, path, requestHandler) {
    this.router[method](path, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const schema = (_b = (_a = this.api[path]) === null || _a === void 0 ? void 0 : _a[method]) === null || _b === void 0 ? void 0 : _b.requestBody;
        if (schema) {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                res.status(http_status_1.status.clientError.BAD_REQUEST);
                res.json(result.error.errors);
                return;
            }
        }
        try {
            const responseBody = yield Promise.resolve(requestHandler(req, res, next));
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