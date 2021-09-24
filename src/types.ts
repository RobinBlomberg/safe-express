import express from 'express';
import { RouteParameters } from 'express-serve-static-core';
import { TypeOf, ZodTypeAny } from 'zod';

export type Api = {
  [KPath in Path]?: RouterDefinition;
};

export type Locals = {
  [K in never]: never;
};

export type MemberOf<T, U> = T extends U ? T : never;

export type Path = `/${string}` | '';

export type Promisable<T> = T | Promise<T>;

export type Query = {
  [K in string]: undefined | string | string[] | Query | Query[];
};

export type Request<
  TApi extends Api,
  TRouterPath extends Path,
  TRoutePath extends Path
> = express.Request<
  RouteParameters<TRoutePath>,
  ResponseBodyOf<TApi, TRouterPath, TRoutePath>,
  RequestBodyOf<TApi, TRoutePath, TRoutePath>,
  Query,
  Locals
>;

export type RequestBodyOf<
  TApi extends Api,
  TRouterPath extends Path,
  TRoutePath extends Path
> = TypeOf<RouterValueOf<TApi, TRouterPath, TRoutePath, 'requestBody'>>;

export type RequestHandler<
  TApi extends Api,
  TRouterPath extends Path,
  TRoutePath extends Path
> = (
  req: Request<TApi, TRouterPath, TRoutePath>,
  res: Response<TApi, TRouterPath, TRoutePath>
) => Promisable<ResponseBodyOf<TApi, TRouterPath, TRoutePath>>;

export type Response<
  TApi extends Api,
  TRouterPath extends Path,
  TRoutePath extends Path
> = express.Response<ResponseBodyOf<TApi, TRouterPath, TRoutePath>, Locals>;

export type ResponseBodyOf<
  TApi extends Api,
  TRouterPath extends Path,
  TRoutePath extends Path
> = TypeOf<RouterValueOf<TApi, TRouterPath, TRoutePath, 'responseBody'>>;

export type RouteDefinition = {
  requestBody: ZodTypeAny;
  responseBody: ZodTypeAny;
};

export type RouterDefinition = {
  [KPath in Path]?: RouteDefinition;
};

export type RouterValueOf<
  TApi extends Api,
  TRouterPath extends Path,
  TRoutePath extends Path,
  TKey extends keyof ValueOf<
    ValueOf<TApi, TRouterPath, RouterDefinition>,
    TRoutePath,
    RouteDefinition
  >
> = ValueOf<
  ValueOf<TApi, TRouterPath, RouterDefinition>,
  TRoutePath,
  RouteDefinition
>[TKey];

export type ValueOf<
  T extends Record<string, unknown>,
  K extends keyof T,
  V
> = MemberOf<T[K], V>;
