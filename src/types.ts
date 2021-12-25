import Express from 'express-serve-static-core';
import { z } from 'zod';

export type ApiSchema = {
  [KPath in Path]: RouterSchema;
};

export type EndpointSchema = {
  [KMethod in Method]?: RequestSchema;
};

export type GenericRequestHandler<
  TParams extends Record<string, unknown> = Record<string, unknown>,
  TResponseBody = unknown,
  TRequestBody = unknown,
  TQuery extends unknown = unknown,
  TProps extends Props = Props,
> = (
  req: Express.Request<
    TParams,
    TResponseBody,
    TRequestBody,
    TQuery,
    Record<string, any>
  > &
    TProps,
  res: Response<TResponseBody>,
  next: Express.NextFunction,
) => void;

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

export type RequestHandler<
  TPath extends Path = Path,
  TRequestSchema extends RequestSchema | undefined = RequestSchema | undefined,
  TProps extends Props = Props,
> = TRequestSchema extends RequestSchema
  ? GenericRequestHandler<
      ParamsShape<TRequestSchema['params']>,
      ZodShape<
        TRequestSchema['responseBody'] | TRequestSchema['responseError']
      >,
      ZodShape<TRequestSchema['requestBody']>,
      QueryShape<TRequestSchema['query']>,
      TProps
    >
  : GenericRequestHandler<
      Express.RouteParameters<TPath>,
      ZodShape,
      ZodShape,
      QueryShape,
      TProps
    >;

export type RequestParser = (
  req: Express.Request,
  res: Express.Response,
) => boolean;

export type RequestSchema = {
  params?: ParamsSchema;
  query?: QuerySchema;
  requestBody?: z.ZodTypeAny;
  responseBody: z.ZodTypeAny;
  responseError?: z.ZodTypeAny;
};

export type RequestShape<TRequestSchema extends RequestSchema> = {
  params: ParamsShape<TRequestSchema['params']>;
  query: QueryShape<TRequestSchema['query']>;
  requestBody: ZodShape<TRequestSchema['requestBody']>;
  responseBody: ZodShape<
    TRequestSchema['responseBody'] | TRequestSchema['responseError']
  >;
};

export type Response<TResponseBody> = Express.Response<
  TResponseBody,
  Record<string, any>
> & {
  eson(value: unknown): void;
};

export type RouterSchema = {
  [KPath in Path]: EndpointSchema;
};

export type ZodShape<
  T extends z.ZodTypeAny | undefined = z.ZodTypeAny | undefined,
> = T extends z.ZodTypeAny ? z.infer<T> : never;
