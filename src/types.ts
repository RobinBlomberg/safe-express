import Express from 'express-serve-static-core';
import qs from 'qs';
import { z } from 'zod';

export type ApiSchema = {
  [KPath in Path]: RouterSchema;
};

export type CombinedParams<
  TPath extends Path = Path,
  TRequestSchema extends RequestSchema = RequestSchema,
> = {
  [K in keyof Express.RouteParameters<TPath>]: ParamsShape<
    TRequestSchema['params']
  >[K] extends undefined
    ? Express.RouteParameters<TPath>[K]
    : ParamsShape<TRequestSchema['params']>[K];
};

export type EndpointSchema = {
  [KMethod in Method]?: RequestSchema;
};

/**
 * Note: body-parser requires the first request body JSON character to be "{" or "[".
 */
export type JsonSchema =
  | z.ZodArray<z.ZodTypeAny>
  | z.ZodIntersection<JsonSchema, JsonSchema>
  | z.ZodLiteral<unknown>
  | z.ZodObject<z.ZodRawShape, 'passthrough' | 'strict' | 'strip'>
  | z.ZodRecord
  | z.ZodTuple
  | z.ZodUnion<[JsonSchema, ...JsonSchema[]]>;

export type Method =
  | 'delete'
  | 'get'
  | 'head'
  | 'options'
  | 'patch'
  | 'post'
  | 'put';

export type ParamsSchema = z.ZodObject<z.ZodRawShape>;

export type ParamsShape<TParamsSchema extends ParamsSchema | undefined> =
  TParamsSchema extends ParamsSchema ? z.infer<TParamsSchema> : never;

export type Path = `/${string}`;

export type Props = {
  [K in number | string | symbol]: unknown;
};

export type QuerySchema =
  | z.ZodObject<z.ZodRawShape>
  | z.ZodOptional<z.ZodObject<z.ZodRawShape>>;

export type QueryShape<
  TQuerySchema extends QuerySchema | undefined = QuerySchema | undefined,
> = TQuerySchema extends QuerySchema
  ? z.infer<TQuerySchema>
  : Record<string, never>;

export type RequestHandler<
  TPath extends Path = Path,
  TRequestSchema extends RequestSchema | undefined = RequestSchema | undefined,
  TProps extends Props = Props,
> = TRequestSchema extends RequestSchema
  ? RequestHandlerWithProps<
      CombinedParams<TPath, TRequestSchema>,
      ZodShape<
        TRequestSchema['responseBody'] | TRequestSchema['responseError']
      >,
      ZodShape<TRequestSchema['requestBody']>,
      QueryShape<TRequestSchema['query']>,
      TProps
    >
  : RequestHandlerWithProps<
      CombinedParams<TPath>,
      ZodShape,
      ZodShape,
      QueryShape,
      TProps
    >;

export type RequestHandlerWithProps<
  TParams extends Record<string, unknown>,
  TResponseBody,
  TRequestBody,
  TQuery extends qs.ParsedQs | undefined,
  TProps extends Props,
> = (
  req: Express.Request<
    TParams,
    TResponseBody,
    TRequestBody,
    TQuery,
    Record<string, any>
  > &
    TProps,
  res: Express.Response<TResponseBody, Record<string, any>>,
  next: Express.NextFunction,
) => void;

export type RequestParser = (
  req: Express.Request,
  res: Express.Response,
) => boolean;

export type RequestSchema = {
  params?: ParamsSchema;
  query?: QuerySchema;
  requestBody?: JsonSchema;
  responseBody: JsonSchema;
  responseError?: JsonSchema;
};

export type RequestShape<TRequestSchema extends RequestSchema> = {
  params: ParamsShape<TRequestSchema['params']>;
  query: QueryShape<TRequestSchema['query']>;
  requestBody: ZodShape<TRequestSchema['requestBody']>;
  responseBody: ZodShape<
    TRequestSchema['responseBody'] | TRequestSchema['responseError']
  >;
};

export type RouterSchema = {
  [KPath in Path]: EndpointSchema;
};

export type ZodShape<
  T extends JsonSchema | undefined = JsonSchema | undefined,
> = T extends JsonSchema ? z.infer<T> : never;
