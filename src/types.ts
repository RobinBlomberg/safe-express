import cors from 'cors';
import express from 'express';
import expressCore from 'express-serve-static-core';
import zod from 'zod';

export type Api<
  TApi extends {
    [KPath in Path]?: RouterApi;
  } = {
    [KPath in Path]?: RouterApi;
  },
> = TApi;

export type AppOptions<TApi extends Api> = {
  api: TApi;
  cors?: cors.CorsOptions;
  log?: TransformFunction | boolean;
};

export type BodyParserError = SyntaxError & {
  body?: string;
  expose?: boolean;
  status?: number;
  statusCode?: number;
  type?: string;
};

export type EndpointDefinition = {
  requestBody?: zod.ZodObject<zod.ZodRawShape> | zod.ZodArray<zod.ZodTypeAny>;
  responseBody: zod.ZodTypeAny;
};

export type ErrorRequestHandler = (
  error: Error,
  req: Request<Api, Method, Path>,
  res: Response<Api, Method, Path>,
  next: express.NextFunction,
) => Promisable<void>;

export type Locals = {
  [K in never]: never;
};

export type Method =
  | 'delete'
  | 'get'
  | 'head'
  | 'options'
  | 'patch'
  | 'post'
  | 'put';

export type MethodUpperCase =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT';

export type MemberOf<T, U> = T extends U ? T : never;

export type Path = `/${string}`;

export type Promisable<T> = T | Promise<T>;

export type Query = {
  [K in string]?: string | string[] | Query | Query[];
};

export type Request<
  TApi extends Api,
  TMethod extends Method,
  TRoutePath extends Path,
> = express.Request<
  expressCore.RouteParameters<TRoutePath>,
  ResponseBodyOf<TApi, TMethod, TRoutePath>,
  RequestBodyOf<TApi, TMethod, TRoutePath>,
  Query,
  Locals
>;

export type RequestBodyOf<
  TApi extends Api,
  TMethod extends Method,
  TRoutePath extends Path,
> = RouterValueOf<
  TApi,
  TMethod,
  TRoutePath,
  'requestBody'
> extends zod.ZodTypeAny
  ? zod.TypeOf<RouterValueOf<TApi, TMethod, TRoutePath, 'requestBody'>>
  : undefined;

export type RequestErrorOptions<TCode extends string> = {
  code: TCode;
  status: number;
};

export type RequestHandler<
  TApi extends Api,
  TMethod extends Method,
  TRoutePath extends Path,
> = (
  req: Request<TApi, TMethod, TRoutePath>,
  res: Response<TApi, TMethod, TRoutePath>,
  next: express.NextFunction,
) => Promisable<ResponseBodyOf<TApi, TMethod, TRoutePath>>;

export type Response<
  TApi extends Api,
  TMethod extends Method,
  TRoutePath extends Path,
> = express.Response<ResponseBodyOf<TApi, TMethod, TRoutePath>, Locals>;

export type ResponseBodyOf<
  TApi extends Api,
  TMethod extends Method,
  TRoutePath extends Path,
> = zod.TypeOf<RouterValueOf<TApi, TMethod, TRoutePath, 'responseBody'>>;

export type RouteDefinition = {
  [K in Method]?: EndpointDefinition;
};

export type RouterApi<
  TRouterApi extends {
    [KPath in Path]?: RouteDefinition;
  } = {
    [KPath in Path]?: RouteDefinition;
  },
> = TRouterApi;

export type RouterValueOf<
  TApi extends Api,
  TMethod extends Method,
  TRoutePath extends Path,
  TKey extends keyof ValueOf<
    ValueOf<TApi, TRoutePath, RouteDefinition>,
    TMethod,
    EndpointDefinition
  >,
> = ValueOf<
  ValueOf<TApi, TRoutePath, RouteDefinition>,
  TMethod,
  EndpointDefinition
>[TKey];

export type TransformFunction = (string: string) => string;

export type ValueOf<
  T extends Record<string, unknown>,
  K extends keyof T,
  V,
> = MemberOf<T[K], V>;
