import { RequestErrorOptions } from '.';
export declare class RequestError<TCode extends string> extends Error {
    readonly code: TCode;
    readonly status: number;
    constructor(options: RequestErrorOptions<TCode>);
}
