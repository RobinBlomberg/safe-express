import Express from 'express-serve-static-core';
import { z } from 'zod';

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

export type ParamsShape<
  TParamsSchema extends z.ZodObject<z.ZodRawShape> | undefined,
> = TParamsSchema extends z.ZodObject<z.ZodRawShape>
  ? z.infer<TParamsSchema>
  : Record<string, never>;

export type Path = `/${string}`;

export type QuerySchema = z.ZodObject<z.ZodRawShape>;

export type QueryShape<
  TQuerySchema extends z.ZodObject<z.ZodRawShape> | undefined,
> = TQuerySchema extends z.ZodObject<z.ZodRawShape>
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
  TRequestBodySchema extends RequestBodySchema | undefined,
> = TRequestBodySchema extends RequestBodySchema
  ? z.infer<TRequestBodySchema>
  : never;

export type RequestHandler<
  TPath extends Path = Path,
  TRequestSchema extends RequestSchema | undefined = RequestSchema | undefined,
> = TRequestSchema extends RequestSchema
  ? Express.RequestHandler<
      {
        [K in keyof Express.RouteParameters<TPath>]: ParamsShape<
          TRequestSchema['params']
        >[K] extends undefined
          ? Express.RouteParameters<TPath>[K]
          : ParamsShape<TRequestSchema['params']>[K];
      },
      ResponseBodyShape<TRequestSchema['responseBody']>,
      RequestBodyShape<TRequestSchema['requestBody']>,
      QueryShape<TRequestSchema['query']>,
      never
    >
  : never;

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

export type ResponseBodyShape<TResponseBodySchema extends ResponseBodySchema> =
  z.infer<TResponseBodySchema>;

export type RouterSchema = {
  [KPath in string]: EndpointSchema;
};
