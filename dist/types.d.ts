import cors from 'cors';
import express from 'express';
import expressCore from 'express-serve-static-core';
import zod from 'zod';
export declare type Api = {
    [KPath in Path]?: RouterApi;
};
export declare type AppOptions<TApi extends Api> = {
    api: TApi;
    cors?: cors.CorsOptions;
    log?: TransformFunction | boolean;
};
export declare type BodyParserError = SyntaxError & {
    body?: string;
    expose?: boolean;
    status?: number;
    statusCode?: number;
    type?: string;
};
export declare type EndpointDefinition = {
    requestBody?: zod.ZodObject<zod.ZodRawShape> | zod.ZodArray<zod.ZodTypeAny>;
    responseBody: zod.ZodTypeAny;
};
export declare type ErrorRequestHandler = (payload: {
    error: Error;
    next: express.NextFunction;
    request: Request<Api, Path, Path, Method>;
    response: Response<Api, Path, Path, Method>;
}) => Promisable<void>;
export declare type Locals = {
    [K in never]: never;
};
export declare type Method = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put';
export declare type MethodUpperCase = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
export declare type MemberOf<T, U> = T extends U ? T : never;
export declare type Path = `/${string}` | '';
export declare type Promisable<T> = T | Promise<T>;
export declare type Query = {
    [K in string]?: string | string[] | Query | Query[];
};
export declare type Request<TApi extends Api, TRouterPath extends Path, TRoutePath extends Path, TMethod extends Method> = express.Request<expressCore.RouteParameters<TRoutePath>, ResponseBodyOf<TApi, TRouterPath, TRoutePath, TMethod>, RequestBodyOf<TApi, TRouterPath, TRoutePath, TMethod>, Query, Locals>;
export declare type RequestBodyOf<TApi extends Api, TRouterPath extends Path, TRoutePath extends Path, TMethod extends Method> = RouterValueOf<TApi, TRouterPath, TRoutePath, TMethod, 'requestBody'> extends zod.ZodTypeAny ? zod.TypeOf<RouterValueOf<TApi, TRouterPath, TRoutePath, TMethod, 'requestBody'>> : undefined;
export declare type RequestErrorOptions<TCode extends string> = {
    code: TCode;
    status: number;
};
export declare type RequestHandler<TApi extends Api, TRouterPath extends Path, TRoutePath extends Path, TMethod extends Method> = (payload: {
    api: TApi;
    next: express.NextFunction;
    request: Request<TApi, TRouterPath, TRoutePath, TMethod>;
    response: Response<TApi, TRouterPath, TRoutePath, TMethod>;
}) => Promisable<ResponseBodyOf<TApi, TRouterPath, TRoutePath, TMethod>>;
export declare type Response<TApi extends Api, TRouterPath extends Path, TRoutePath extends Path, TMethod extends Method> = express.Response<ResponseBodyOf<TApi, TRouterPath, TRoutePath, TMethod>, Locals>;
export declare type ResponseBodyOf<TApi extends Api, TRouterPath extends Path, TRoutePath extends Path, TMethod extends Method> = zod.TypeOf<RouterValueOf<TApi, TRouterPath, TRoutePath, TMethod, 'responseBody'>>;
export declare type RouteDefinition = {
    [K in Method]?: EndpointDefinition;
};
export declare type RouterApi = {
    [KPath in Path]?: RouteDefinition;
};
export declare type RouterValueOf<TApi extends Api, TRouterPath extends Path, TRoutePath extends Path, TMethod extends Method, TKey extends keyof ValueOf<ValueOf<ValueOf<TApi, TRouterPath, RouterApi>, TRoutePath, RouteDefinition>, TMethod, EndpointDefinition>> = ValueOf<ValueOf<ValueOf<TApi, TRouterPath, RouterApi>, TRoutePath, RouteDefinition>, TMethod, EndpointDefinition>[TKey];
export declare type TransformFunction = (string: string) => string;
export declare type ValueOf<T extends Record<string, unknown>, K extends keyof T, V> = MemberOf<T[K], V>;
