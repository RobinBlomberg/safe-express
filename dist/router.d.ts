import express from 'express';
import { ApiRequestHandler, Path, RequestHandler, RouterApi } from '.';
export declare class SafeRouter<TApi extends RouterApi> {
    #private;
    readonly api: TApi;
    readonly router: express.Router;
    constructor(api: TApi);
    delete<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'delete', TRoutePath>): void;
    delete<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'delete', TRoutePath>): void;
    get<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'get', TRoutePath>): void;
    get<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'get', TRoutePath>): void;
    head<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'head', TRoutePath>): void;
    head<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'head', TRoutePath>): void;
    options<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'options', TRoutePath>): void;
    options<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'options', TRoutePath>): void;
    patch<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'patch', TRoutePath>): void;
    patch<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'patch', TRoutePath>): void;
    post<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'post', TRoutePath>): void;
    post<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'post', TRoutePath>): void;
    put<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'put', TRoutePath>): void;
    put<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'put', TRoutePath>): void;
}
