import express from 'express-serve-static-core';
import { z } from 'zod';

export type ApiRequestHandler<
  TPath extends Path = Path,
  TRequestSchema = unknown,
  TProps extends Props = Props,
> = TRequestSchema extends ApiRequestSchema
  ? RequestHandler<
      TProps,
      ParamsShape<TRequestSchema['params']>,
      ResponseBodyShape<
        TRequestSchema['responseBody'] | TRequestSchema['responseError']
      >,
      RequestBodyShape<TRequestSchema['requestBody']>,
      QueryShape<TRequestSchema['query']>
    >
  : RequestHandler<
      TProps,
      express.RouteParameters<TPath>,
      ResponseBodyShape,
      RequestBodyShape,
      QueryShape
    >;

export type ApiRequestSchema = {
  params?: ParamsSchema;
  query?: QuerySchema;
  requestBody?: RequestBodySchema;
  responseBody: ResponseBodySchema;
  responseError?: ResponseErrorSchema;
};

export type ApiRequestShape<TRequestSchema> =
  TRequestSchema extends ApiRequestSchema
    ? {
        params: ParamsShape<TRequestSchema['params']>;
        query: QueryShape<TRequestSchema['query']>;
        requestBody: RequestBodyShape<TRequestSchema['requestBody']>;
        responseBody: ResponseBodyShape<
          TRequestSchema['responseBody'] | TRequestSchema['responseError']
        >;
      }
    : {
        params: ParamsShape;
        query: QueryShape;
        requestBody: RequestBodyShape;
        responseBody: ResponseBodyShape;
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

export type ParamsSchema = {
  [K: string]: ParamsSchemaValue;
};

export type ParamsSchemaValue = z.ZodNumber | z.ZodString;

export type ParamsShape<
  TParamsSchema extends ParamsSchema | undefined = ParamsSchema | undefined,
> = TParamsSchema extends ParamsSchema
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
  TResponseBody = unknown,
  TRequestBody = any, // This must be "any".
  TQuery = Record<string, string>,
  TLocals extends Record<string, unknown> = Record<string, unknown>,
> = express.Request<TParams, TResponseBody, TRequestBody, TQuery, TLocals>;

export type RequestBodySchema = z.ZodTypeAny;

export type RequestBodyShape<
  T extends z.ZodTypeAny | undefined = z.ZodTypeAny | undefined,
> = ZodShape<T>;

export type RequestHandler<
  TProps extends Props = Props,
  TParams extends Record<string, any> = Record<string, any>, // This must be "any".
  TResponseBody = unknown,
  TRequestBody = unknown,
  TQuery extends any = any, // This must be "any".
> = (
  req: Request<
    TParams,
    TResponseBody,
    TRequestBody,
    TQuery,
    Record<string, unknown>
  > &
    TProps,
  res: Response<TResponseBody>,
  next: express.NextFunction,
) => void;

export type RequestParser = (req: Request, res: Response) => boolean;

export type Response<TResponseBody = unknown> = express.Response<
  TResponseBody,
  Record<string, unknown>
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
  eson(body?: TResponseBody): void;
};

export type ResponseBodySchema = z.ZodTypeAny;

export type ResponseBodyShape<
  T extends z.ZodTypeAny | undefined = z.ZodTypeAny | undefined,
> = ZodShape<T>;

export type ResponseErrorSchema = z.ZodTypeAny;

export type RouterSchema = {
  [KPath in Path]: EndpointSchema;
};

export type ZodShape<
  T extends z.ZodTypeAny | undefined = z.ZodTypeAny | undefined,
> = T extends z.ZodTypeAny ? z.infer<T> : never;
