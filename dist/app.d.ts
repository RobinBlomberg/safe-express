import express from 'express';
import { AppOptions, RequestHandler, SafeRouter } from '.';
import { Api } from './types';
export declare class SafeApp<TApi extends Api> {
    #private;
    constructor(options: AppOptions<TApi>);
    listen(port: number | string, callback?: () => void): this;
    useErrorRequestHandler(errorRequestHandler: express.ErrorRequestHandler): this;
    useRouter<TRouterPath extends keyof TApi & string, TMiddleware extends RequestHandler[]>(path: TRouterPath, router: SafeRouter<TApi[TRouterPath], TMiddleware>): this;
}
