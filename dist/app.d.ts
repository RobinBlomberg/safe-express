import express from 'express';
import { AppOptions, SafeRouter } from '.';
import { Api } from './types';
export declare class SafeApp<TApi extends Api> {
    #private;
    constructor(options: AppOptions<TApi>);
    listen(port: number | string, callback?: () => void): this;
    useErrorRequestHandler(errorRequestHandler: express.ErrorRequestHandler): this;
    useMiddleware(requestHandler: express.RequestHandler): this;
    useRouter<TRouterPath extends keyof TApi & string>(path: TRouterPath, router: SafeRouter<TApi[TRouterPath]>): this;
}
