import cors from 'cors';
import express from 'express';
import expressCore from 'express-serve-static-core';
import zod from 'zod';
export declare type Api<TApi extends {
    [KPath in Path]?: RouterApi;
} = {
    [KPath in Path]?: RouterApi;
}> = TApi;
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
export declare type ErrorRequestHandler = (error: Error, req: Request<Api, Method, Path>, res: Response<Api, Method, Path>, next: express.NextFunction) => Promisable<void>;
export declare type Locals = {
    [K in never]: never;
};
export declare type Method = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put';
export declare type MethodUpperCase = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
export declare type MemberOf<T, U> = T extends U ? T : never;
export declare type Path = `/${string}`;
export declare type Promisable<T> = T | Promise<T>;
export declare type Query = {
    [K in string]?: string | string[] | Query | Query[];
};
export declare type Request<TApi extends Api, TMethod extends Method, TRoutePath extends Path> = express.Request<expressCore.RouteParameters<TRoutePath>, ResponseBodyOf<TApi, TMethod, TRoutePath>, RequestBodyOf<TApi, TMethod, TRoutePath>, Query, Locals>;
export declare type RequestBodyOf<TApi extends Api, TMethod extends Method, TRoutePath extends Path> = RouterValueOf<TApi, TMethod, TRoutePath, 'requestBody'> extends zod.ZodTypeAny ? zod.TypeOf<RouterValueOf<TApi, TMethod, TRoutePath, 'requestBody'>> : undefined;
export declare type RequestErrorOptions<TCode extends string> = {
    code: TCode;
    status: number;
};
export declare type RequestHandler<TApi extends Api, TMethod extends Method, TRoutePath extends Path> = (req: Request<TApi, TMethod, TRoutePath>, res: Response<TApi, TMethod, TRoutePath>, next: express.NextFunction) => Promisable<ResponseBodyOf<TApi, TMethod, TRoutePath>>;
export declare type Response<TApi extends Api, TMethod extends Method, TRoutePath extends Path> = express.Response<ResponseBodyOf<TApi, TMethod, TRoutePath>, Locals>;
export declare type ResponseBodyOf<TApi extends Api, TMethod extends Method, TRoutePath extends Path> = zod.TypeOf<RouterValueOf<TApi, TMethod, TRoutePath, 'responseBody'>>;
export declare type RouteDefinition = {
    [K in Method]?: EndpointDefinition;
};
export declare type RouterApi<TRouterApi extends {
    [KPath in Path]?: RouteDefinition;
} = {
    [KPath in Path]?: RouteDefinition;
}> = TRouterApi;
export declare type RouterValueOf<TApi extends Api, TMethod extends Method, TRoutePath extends Path, TKey extends keyof ValueOf<ValueOf<TApi, TRoutePath, RouteDefinition>, TMethod, EndpointDefinition>> = ValueOf<ValueOf<TApi, TRoutePath, RouteDefinition>, TMethod, EndpointDefinition>[TKey];
export declare type TransformFunction = (string: string) => string;
export declare type ValueOf<T extends Record<string, unknown>, K extends keyof T, V> = MemberOf<T[K], V>;
