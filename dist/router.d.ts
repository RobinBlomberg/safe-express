import express from 'express';
import { ApiRequestHandler, MiddlewareProps, Path, RequestHandler, RouterApi, SafeRouterOptions } from '.';
export declare class SafeRouter<TApi extends RouterApi, TMiddleware extends RequestHandler[]> {
    #private;
    readonly api: TApi;
    readonly middleware: RequestHandler[];
    readonly router: express.Router;
    constructor(api: TApi, options?: SafeRouterOptions<TMiddleware>);
    delete<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'delete', TRoutePath, MiddlewareProps<TMiddleware>>): void;
    delete<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'delete', TRoutePath, MiddlewareProps<TMiddleware>>): void;
    get<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'get', TRoutePath, MiddlewareProps<TMiddleware>>): void;
    get<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'get', TRoutePath, MiddlewareProps<TMiddleware>>): void;
    head<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'head', TRoutePath, MiddlewareProps<TMiddleware>>): void;
    head<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'head', TRoutePath, MiddlewareProps<TMiddleware>>): void;
    options<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'options', TRoutePath, MiddlewareProps<TMiddleware>>): void;
    options<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'options', TRoutePath, MiddlewareProps<TMiddleware>>): void;
    patch<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'patch', TRoutePath, MiddlewareProps<TMiddleware>>): void;
    patch<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'patch', TRoutePath, MiddlewareProps<TMiddleware>>): void;
    post<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'post', TRoutePath, MiddlewareProps<TMiddleware>>): void;
    post<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'post', TRoutePath, MiddlewareProps<TMiddleware>>): void;
    put<TRoutePath extends Path & keyof TApi>(path: TRoutePath, requestHandler: ApiRequestHandler<TApi, 'put', TRoutePath, MiddlewareProps<TMiddleware>>): void;
    put<TRoutePath extends Path & keyof TApi>(path: TRoutePath, middleware: RequestHandler[], requestHandler: ApiRequestHandler<TApi, 'put', TRoutePath, MiddlewareProps<TMiddleware>>): void;
}
