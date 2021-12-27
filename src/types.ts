import express from 'express-serve-static-core';
import { z } from 'zod';

export type ApiRequestHandler<
  TPath extends Path = Path,
  TRequestSchema extends ApiRequestSchema | undefined =
    | ApiRequestSchema
    | undefined,
  TProps extends Props = Props,
> = TRequestSchema extends ApiRequestSchema
  ? RequestHandler<
      ParamsShape<TRequestSchema['params']>,
      ZodShape<
        TRequestSchema['responseBody'] | TRequestSchema['responseError']
      >,
      ZodShape<TRequestSchema['requestBody']>,
      QueryShape<TRequestSchema['query']>,
      TProps
    >
  : RequestHandler<
      express.RouteParameters<TPath>,
      ZodShape,
      ZodShape,
      QueryShape,
      TProps
    >;

export type ApiRequestSchema = {
  params?: ParamsSchema;
  query?: QuerySchema;
  requestBody?: z.ZodTypeAny;
  responseBody: z.ZodTypeAny;
  responseError?: z.ZodTypeAny;
};

export type ApiRequestShape<TRequestSchema extends ApiRequestSchema> = {
  params: ParamsShape<TRequestSchema['params']>;
  query: QueryShape<TRequestSchema['query']>;
  requestBody: ZodShape<TRequestSchema['requestBody']>;
  responseBody: ZodShape<
    TRequestSchema['responseBody'] | TRequestSchema['responseError']
  >;
};

export type ApiSchema = {
  [KPath in Path]: RouterSchema;
};

export type EndpointSchema = {
  [KMethod in Method]?: ApiRequestSchema;
};

export type Enumerable<T> = T | T[];

export type Method =
  | 'delete'
  | 'get'
  | 'head'
  | 'options'
  | 'patch'
  | 'post'
  | 'put';

export type ParamsValue = z.ZodNumber | z.ZodString;

export type ParamsSchema = {
  [K: string]: ParamsValue;
};

export type ParamsShape<TParamsSchema extends ParamsSchema | undefined> =
  TParamsSchema extends ParamsSchema
    ? { [K in keyof TParamsSchema]: z.infer<TParamsSchema[K]> }
    : never;

export type Path = `/${string}`;

export type Props = {
  [K in number | string | symbol]: unknown;
};

export type QuerySchema = z.ZodTypeAny;

export type QueryShape<
  TQuerySchema extends QuerySchema | undefined = QuerySchema | undefined,
> = TQuerySchema extends QuerySchema ? z.infer<TQuerySchema> : never;

export type Request<
  TParams = Record<string, string>,
  TResponseBody = any,
  TRequestBody = any,
  TQuery = Record<string, string>,
  TLocals extends Record<string, any> = Record<string, any>,
> = express.Request<TParams, TResponseBody, TRequestBody, TQuery, TLocals>;

export type RequestHandler<
  TParams extends Record<string, any> = Record<string, any>,
  TResponseBody = unknown,
  TRequestBody = any,
  TQuery extends any = any,
  TProps extends Props = Props,
> = (
  req: Request<
    TParams,
    TResponseBody,
    TRequestBody,
    TQuery,
    Record<string, any>
  > &
    TProps,
  res: Response<TResponseBody>,
  next: express.NextFunction,
) => void;

export type RequestParser = (req: Request, res: Response) => boolean;

export type Response<TResponseBody = unknown> = express.Response<
  TResponseBody,
  Record<string, any>
> & {
  /**
   * Send ESON response.
   *
   * Examples:
   *
   *     res.eson(null);
   *     res.eson({ user: 'tj' });
   *     res.status(500).eson('oh noes!');
   *     res.status(404).eson('I dont have that');
   */
  eson(body?: any): void;
};

export type RouterSchema = {
  [KPath in Path]: EndpointSchema;
};

export type ZodShape<
  T extends z.ZodTypeAny | undefined = z.ZodTypeAny | undefined,
> = T extends z.ZodTypeAny ? z.infer<T> : never;
