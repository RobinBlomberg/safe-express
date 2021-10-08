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

export type ParsedQuery = {
  [K in string]: undefined | string | string[] | ParsedQuery | ParsedQuery[];
};

export type RequestHandler<TRequestSchema extends RequestSchema> =
  Express.RequestHandler<
    Express.ParamsDictionary,
    unknown,
    TRequestSchema['requestBody'],
    ParsedQuery,
    Record<string, unknown>
  >;

export type RequestSchema = {
  requestBody?: z.ZodType<any>;
};

export type RequestShape<TRequestSchema extends RequestSchema> = {
  requestBody: TRequestSchema['requestBody'] extends z.ZodType<any>
    ? z.infer<TRequestSchema['requestBody']>
    : never;
};

export type RouterSchema = {
  [KPath in string]: EndpointSchema;
};
