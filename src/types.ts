import Express from 'express-serve-static-core';
import qs from 'qs';
import { z } from 'zod';

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
  TParamsSchema extends ParamsSchema ? z.infer<TParamsSchema> : {};

export type Path = `/${string}`;

export type Props = {
  [K in number | string | symbol]: unknown;
};

export type QuerySchema = z.ZodObject<z.ZodRawShape>;

export type QueryShape<
  TQuerySchema extends QuerySchema | undefined = QuerySchema | undefined,
> = TQuerySchema extends QuerySchema
  ? z.infer<TQuerySchema>
  : Record<string, never>;

/**
 * Note: body-parser requires the first request body JSON character to be "{" or "[".
 */
export type RequestBodySchema = z.ZodTypeAny;
// | z.ZodArray<z.ZodTypeAny>
// | z.ZodIntersection<RequestBodySchema, RequestBodySchema>
// | z.ZodObject<z.ZodRawShape>
// | z.ZodRecord
// | z.ZodTuple
// | z.ZodUnion<[RequestBodySchema, ...RequestBodySchema[]]>;

export type RequestBodyShape<
  TRequestBodySchema extends RequestBodySchema | undefined =
    | RequestBodySchema
    | undefined,
> = TRequestBodySchema extends RequestBodySchema
  ? z.infer<TRequestBodySchema>
  : never;

export type RequestHandler<
  TPath extends Path = Path,
  TRequestSchema extends RequestSchema | undefined = RequestSchema | undefined,
  TProps extends Props = Props,
> = TRequestSchema extends RequestSchema
  ? RequestHandlerWithProps<
      CombinedParams<TPath, TRequestSchema>,
      ResponseBodyShape<TRequestSchema['responseBody']>,
      RequestBodyShape<TRequestSchema['requestBody']>,
      QueryShape<TRequestSchema['query']>,
      TProps
    >
  : RequestHandlerWithProps<
      CombinedParams<TPath>,
      ResponseBodyShape,
      RequestBodyShape,
      QueryShape,
      TProps
    >;

export type RequestHandlerWithProps<
  TParams extends Record<string, unknown>,
  TResponseBody,
  TRequestBody,
  TQuery extends qs.ParsedQs,
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
  requestBody?: RequestBodySchema;
  responseBody: ResponseBodySchema;
};

export type RequestShape<TRequestSchema extends RequestSchema> = {
  params: ParamsShape<TRequestSchema['params']>;
  query: QueryShape<TRequestSchema['query']>;
  requestBody: RequestBodyShape<TRequestSchema['requestBody']>;
  responseBody: ResponseBodyShape<TRequestSchema['responseBody']>;
};

export type ResponseBodySchema = z.ZodTypeAny;

export type ResponseBodyShape<
  TResponseBodySchema extends ResponseBodySchema = ResponseBodySchema,
> = z.infer<TResponseBodySchema>;

export type RouterSchema = {
  [KPath in string]: EndpointSchema;
};
