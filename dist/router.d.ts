import express from 'express';
import { ApiRequestHandler, Middleware, Path, RequestData, RouterApi, SafeRouterOptions } from '.';
export declare class SafeRouter<TApi extends RouterApi, TData extends RequestData = RequestData> {
    #private;
    readonly api: TApi;
    readonly middleware: Middleware<TData>[];
    readonly router: express.Router;
    constructor(api: TApi, options?: SafeRouterOptions<TData>);
    delete<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'delete', TRoutePath, TData>): void;
    delete<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: Middleware<TData>, requestHandler: ApiRequestHandler<TApi, 'delete', TRoutePath, TData>): void;
    get<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'get', TRoutePath, TData>): void;
    get<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: Middleware<TData>[], requestHandler: ApiRequestHandler<TApi, 'get', TRoutePath, TData>): void;
    head<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'head', TRoutePath, TData>): void;
    head<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: Middleware<TData>[], requestHandler: ApiRequestHandler<TApi, 'head', TRoutePath, TData>): void;
    options<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'options', TRoutePath, TData>): void;
    options<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: Middleware<TData>[], requestHandler: ApiRequestHandler<TApi, 'options', TRoutePath, TData>): void;
    patch<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'patch', TRoutePath, TData>): void;
    patch<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: Middleware<TData>[], requestHandler: ApiRequestHandler<TApi, 'patch', TRoutePath, TData>): void;
    post<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'post', TRoutePath, TData>): void;
    post<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: Middleware<TData>[], requestHandler: ApiRequestHandler<TApi, 'post', TRoutePath, TData>): void;
    put<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'put', TRoutePath, TData>): void;
    put<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: Middleware<TData>[], requestHandler: ApiRequestHandler<TApi, 'put', TRoutePath, TData>): void;
}
