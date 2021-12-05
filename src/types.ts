import Express from 'express-serve-static-core';
import { z } from 'zod';

export type ApiSchema = {
  [KPath in Path]: RouterSchema;
};

export type EndpointSchema = {
  [KMethod in Method]?: RequestSchema;
};

export type Json5Schema = z.ZodTypeAny;

/**
 * NOTE: body-parser requires the first request body JSON character to be "{" or "[".
 */
export type JsonRequestBodySchema =
  | z.ZodArray<JsonSchema, z.ArrayCardinality>
  | z.ZodEffects<JsonRequestBodySchema, unknown, unknown>
  | z.ZodIntersection<JsonRequestBodySchema, JsonRequestBodySchema>
  | z.ZodObject<{ [K: string]: JsonSchema }, 'passthrough' | 'strict' | 'strip'>
  | z.ZodOptional<JsonRequestBodySchema>
  | z.ZodRecord<z.ZodString, JsonSchema>
  | z.ZodTuple<[JsonRequestBodySchema, ...JsonRequestBodySchema[]]>
  | z.ZodUnion<[JsonRequestBodySchema, ...JsonRequestBodySchema[]]>;

export type JsonSchema =
  | z.ZodArray<z.ZodTypeAny, z.ArrayCardinality>
  | z.ZodBoolean
  | z.ZodDate // This will be converted to a string when serializing JSON.
  | z.ZodEffects<JsonSchema, unknown, unknown>
  | z.ZodIntersection<JsonSchema, JsonSchema>
  | z.ZodLiteral<boolean | number | string>
  | z.ZodNull
  | z.ZodNumber
  // @ts-expect-error This produces a circular reference for some reason:
  | z.ZodObject<{ [K: string]: JsonSchema }, 'passthrough' | 'strict' | 'strip'>
  | z.ZodOptional<JsonSchema>
  | z.ZodRecord<z.ZodString, JsonSchema>
  | z.ZodString
  | z.ZodTuple<[JsonSchema, ...JsonSchema[]]>
  | z.ZodUnion<[JsonSchema, ...JsonSchema[]]>;

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

export type QuerySchema = Json5Schema;

export type QueryShape<
  TQuerySchema extends QuerySchema | undefined = QuerySchema | undefined,
> = TQuerySchema extends QuerySchema ? z.infer<TQuerySchema> : never;

export type RequestHandler<
  TPath extends Path = Path,
  TRequestSchema extends RequestSchema | undefined = RequestSchema | undefined,
  TProps extends Props = Props,
> = TRequestSchema extends RequestSchema
  ? RequestHandlerWithProps<
      ParamsShape<TRequestSchema['params']>,
      ZodShape<
        TRequestSchema['responseBody'] | TRequestSchema['responseError']
      >,
      ZodShape<TRequestSchema['requestBody']>,
      QueryShape<TRequestSchema['query']>,
      TProps
    >
  : RequestHandlerWithProps<
      Express.RouteParameters<TPath>,
      ZodShape,
      ZodShape,
      QueryShape,
      TProps
    >;

export type RequestHandlerWithProps<
  TParams extends Record<string, unknown>,
  TResponseBody,
  TRequestBody,
  TQuery extends unknown,
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
  requestBody?: JsonRequestBodySchema;
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
