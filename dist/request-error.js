"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestError = void 0;
class RequestError extends Error {
    constructor(options) {
        super(options.code);
        this.code = options.code;
        this.name = RequestError.name;
        this.status = options.status;
    }
}
exports.RequestError = RequestError;
//# sourceMappingURL=request-error.js.map