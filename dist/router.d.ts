import express from 'express';
import { Path, RequestHandler, RouterApi } from '.';
export declare class SafeRouter<TApi extends RouterApi> {
    #private;
    readonly api: TApi;
    readonly router: express.Router;
    constructor(api: TApi);
    delete<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: RequestHandler<TApi, 'delete', TRoutePath>): void;
    get<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: RequestHandler<TApi, 'get', TRoutePath>): void;
    head<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: RequestHandler<TApi, 'head', TRoutePath>): void;
    options<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: RequestHandler<TApi, 'options', TRoutePath>): void;
    patch<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: RequestHandler<TApi, 'patch', TRoutePath>): void;
    post<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: RequestHandler<TApi, 'post', TRoutePath>): void;
    put<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: RequestHandler<TApi, 'put', TRoutePath>): void;
}
