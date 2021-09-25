"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const MethodColorMap = {
    DELETE: chalk_1.default.red,
    GET: chalk_1.default.blue,
    HEAD: chalk_1.default.magenta,
    OPTIONS: chalk_1.default.white,
    PATCH: chalk_1.default.cyan,
    POST: chalk_1.default.green,
    PUT: chalk_1.default.yellow,
};
const StatusColorMap = {
    1: chalk_1.default.blue,
    2: chalk_1.default.green,
    3: chalk_1.default.cyan,
    4: chalk_1.default.yellow,
    5: chalk_1.default.red,
};
const createFormatter = (transform) => {
    const formatter = (tokens, req, res) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const colorizeMethod = (_a = MethodColorMap[req.method]) !== null && _a !== void 0 ? _a : chalk_1.default.white;
        const colorizeStatus = (_b = StatusColorMap[String(res.statusCode)[0]]) !== null && _b !== void 0 ? _b : chalk_1.default.white;
        const module = chalk_1.default.gray('http');
        const method = colorizeMethod((_c = tokens.method) === null || _c === void 0 ? void 0 : _c.call(tokens, req, res));
        const url = (_d = tokens.url) === null || _d === void 0 ? void 0 : _d.call(tokens, req, res);
        const status = colorizeStatus((_e = tokens.status) === null || _e === void 0 ? void 0 : _e.call(tokens, req, res));
        const ms = parseInt((_g = (_f = tokens['response-time']) === null || _f === void 0 ? void 0 : _f.call(tokens, req, res)) !== null && _g !== void 0 ? _g : '');
        const string = `${module} ${method} ${url} ${status} ${ms}ms`;
        return transform ? transform(string) : string;
    };
    return formatter;
};
const logger = (transform) => {
    return createFormatter(transform);
};
exports.logger = logger;
//# sourceMappingURL=morgan-formatter.js.map