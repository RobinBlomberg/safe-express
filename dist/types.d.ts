import cors from 'cors';
import express from 'express';
import expressCore from 'express-serve-static-core';
import { z } from 'zod';
export type { CookieOptions } from 'express';
export declare type Api<TApi extends {
    [KPath in Path]?: RouterApi;
} = {
    [KPath in Path]?: RouterApi;
}> = TApi;
export declare type ApiRequest<TApi extends Api, TMethod extends Method, TRoutePath extends Path, TData extends RequestData> = Request<expressCore.RouteParameters<TRoutePath>, ResponseBodyOf<TApi, TMethod, TRoutePath>, RequestBodyOf<TApi, TMethod, TRoutePath>, Query, Locals, TData>;
export declare type ApiRequestHandler<TApi extends Api = Api, TMethod extends Method = Method, TRoutePath extends Path = Path, TData extends RequestData = RequestData> = (req: ApiRequest<TApi, TMethod, TRoutePath, TData>, res: Response<TApi, TMethod, TRoutePath>, next: express.NextFunction) => Promisable<ResponseBodyOf<TApi, TMethod, TRoutePath>>;
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
    requestBody?: ValidRequestBody;
    responseBody: z.ZodTypeAny;
};
export declare type ErrorRequestHandler = (error: Error, req: ApiRequest<Api, Method, Path, RequestData>, res: Response<Api, Method, Path>, next: express.NextFunction) => Promisable<void>;
export declare type Locals = {
    [K in never]: never;
};
export declare type Method = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put';
export declare type MethodUpperCase = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
export declare type MemberOf<T, U> = T extends U ? T : never;
export declare type MiddlewareProps<TMiddleware extends RequestHandler[]> = Required<UnionToIntersection<Parameters<TMiddleware[number]>[0]['data']>>;
export declare type Params = {
    [K in string]?: string;
};
export declare type Path = `/${string}`;
export declare type Promisable<T> = T | Promise<T>;
export declare type Query = {
    [K in string]?: string | string[] | Query | Query[];
};
export declare type Request<TParams extends Params = Params, TResponseBody = unknown, TRequestBody = unknown, TQuery extends Query = Query, TLocals extends Locals = Locals, TData extends RequestData = RequestData> = express.Request<TParams, TResponseBody, TRequestBody, TQuery, TLocals> & {
    data: TData;
};
export declare type RequestBodyOf<TApi extends Api, TMethod extends Method, TRoutePath extends Path> = RouterValueOf<TApi, TMethod, TRoutePath, 'requestBody'> extends z.ZodTypeAny ? z.TypeOf<RouterValueOf<TApi, TMethod, TRoutePath, 'requestBody'>> : undefined;
export declare type RequestData = {
    [K in string]?: unknown;
};
export declare type RequestErrorOptions<TCode extends string> = {
    code: TCode;
    status: number;
};
export declare type RequestHandler<TParams extends Params = Params, TResponseBody = unknown, TRequestBody = unknown, TQuery extends Query = Query, TLocals extends Locals = Locals, TData extends RequestData = any> = (req: Request<TParams, TResponseBody, TRequestBody, TQuery, TLocals, TData>, res: express.Response<TResponseBody, TLocals>, next: express.NextFunction) => Promisable<unknown>;
export declare type RequestHandlerWithMiddleware<TMiddleware extends any[]> = RequestHandler<Params, unknown, unknown, Query, Locals, MiddlewareProps<TMiddleware>>;
export declare type Response<TApi extends Api, TMethod extends Method, TRoutePath extends Path> = express.Response<ResponseBodyOf<TApi, TMethod, TRoutePath>, Locals>;
export declare type ResponseBodyOf<TApi extends Api, TMethod extends Method, TRoutePath extends Path> = z.TypeOf<RouterValueOf<TApi, TMethod, TRoutePath, 'responseBody'>>;
export declare type RouteDefinition = {
    [K in Method]?: EndpointDefinition;
};
export declare type RouterApi<TRouterApi extends {
    [KPath in Path]?: RouteDefinition;
} = {
    [KPath in Path]?: RouteDefinition;
}> = TRouterApi;
export declare type RouterValueOf<TApi extends Api, TMethod extends Method, TRoutePath extends Path, TKey extends keyof ValueOf<ValueOf<TApi, TRoutePath, RouteDefinition>, TMethod, EndpointDefinition>> = ValueOf<ValueOf<TApi, TRoutePath, RouteDefinition>, TMethod, EndpointDefinition>[TKey];
export declare type SafeRouterOptions<TMiddleware extends RequestHandler[]> = {
    middleware?: TMiddleware;
};
export declare type TransformFunction = (string: string) => string;
export declare type UnionToIntersection<T> = (T extends any ? (K: T) => void : never) extends (K: infer I) => void ? I : never;
/**
 * Note: body-parser requires the first request body JSON character to be "{" or "[".
 */
export declare type ValidRequestBody = ValidRequestBodyPrimitive | z.ZodEffects<ValidRequestBodyPrimitive>;
export declare type ValidRequestBodyPrimitive = z.ZodArray<z.ZodTypeAny> | z.ZodIntersection<ValidRequestBody, ValidRequestBody> | z.ZodNullable<ValidRequestBodyPrimitive> | z.ZodObject<z.ZodRawShape, 'passthrough' | 'strict' | 'strip'> | z.ZodRecord | z.ZodTuple | z.ZodUnion<[ValidRequestBody, ...ValidRequestBody[]]>;
export declare type ValueOf<T extends Record<string, unknown>, K extends keyof T, V> = MemberOf<T[K], V>;
