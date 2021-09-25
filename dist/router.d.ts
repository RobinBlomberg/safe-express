import express from 'express';
import { Api, Path, RequestHandler } from './types';
export declare class SafeRouter<TApi extends Api, TRouterPath extends Path & keyof TApi> {
    #private;
    readonly api: TApi;
    readonly path: TRouterPath;
    readonly router: express.Router;
    constructor(api: TApi, path: TRouterPath);
    delete<TRoutePath extends Path & keyof TApi[TRouterPath]>(path: TRoutePath, requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'delete'>): void;
    get<TRoutePath extends Path & keyof TApi[TRouterPath]>(path: TRoutePath, requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'get'>): void;
    head<TRoutePath extends Path & keyof TApi[TRouterPath]>(path: TRoutePath, requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'head'>): void;
    options<TRoutePath extends Path & keyof TApi[TRouterPath]>(path: TRoutePath, requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'options'>): void;
    patch<TRoutePath extends Path & keyof TApi[TRouterPath]>(path: TRoutePath, requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'patch'>): void;
    post<TRoutePath extends Path & keyof TApi[TRouterPath]>(path: TRoutePath, requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'post'>): void;
    put<TRoutePath extends Path & keyof TApi[TRouterPath]>(path: TRoutePath, requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'put'>): void;
}
