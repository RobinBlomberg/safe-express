import express from 'express';
import { RouteParameters } from 'express-serve-static-core';
import { BodyParserError, Method, RequestError, status } from '.';
import {
  Api,
  Locals,
  Path,
  Query,
  RequestBodyOf,
  RequestHandler,
  ResponseBodyOf,
} from './types';

export class SafeRouter<
  TApi extends Api,
  TRouterPath extends Path & keyof TApi,
> {
  readonly api: TApi;
  readonly path: TRouterPath;
  readonly router: express.Router;

  constructor(api: TApi, path: TRouterPath) {
    this.api = api;
    this.path = path;
    this.router = express.Router();
  }

  #on<
    TRoutePath extends Path & keyof TApi[TRouterPath],
    TMethod extends Method,
  >(
    method: TMethod,
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, TMethod>,
  ) {
    this.router[method]<
      TRoutePath,
      RouteParameters<TRoutePath>,
      ResponseBodyOf<TApi, TRouterPath, TRoutePath, TMethod>,
      RequestBodyOf<TApi, TRouterPath, TRoutePath, TMethod>,
      Query,
      Locals
    >(path, async (request, response, next) => {
      const schema = this.api[this.path]?.[path]?.[method]?.requestBody;
      if (schema) {
        const result = schema.safeParse(request.body);
        if (!result.success) {
          response.status(status.BAD_REQUEST);
          response.json(result.error.errors);
          return;
        }
      }

      try {
        const responseBody = await Promise.resolve(
          requestHandler({
            api: this.api,
            next,
            request,
            response,
          }),
        );

        response.json(responseBody ?? null);
      } catch (error: unknown) {
        if (error instanceof RequestError) {
          response.status(error.status);
          response.json({
            code: error.code,
          });
        } else if (
          error instanceof SyntaxError &&
          (error as BodyParserError).type === 'entity.parse.failed'
        ) {
          response.status(status.BAD_REQUEST);
          response.json('Expected request body to be an object or array.');
        } else {
          console.error(error);
          response.status(status.INTERNAL_SERVER_ERROR);
          response.json(status[status.INTERNAL_SERVER_ERROR]);
        }
      }
    });
  }

  delete<TRoutePath extends Path & keyof TApi[TRouterPath]>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'delete'>,
  ) {
    this.#on('delete', path, requestHandler);
  }

  get<TRoutePath extends Path & keyof TApi[TRouterPath]>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'get'>,
  ) {
    this.#on('get', path, requestHandler);
  }

  head<TRoutePath extends Path & keyof TApi[TRouterPath]>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'head'>,
  ) {
    this.#on('head', path, requestHandler);
  }

  options<TRoutePath extends Path & keyof TApi[TRouterPath]>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'options'>,
  ) {
    this.#on('options', path, requestHandler);
  }

  patch<TRoutePath extends Path & keyof TApi[TRouterPath]>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'patch'>,
  ) {
    this.#on('patch', path, requestHandler);
  }

  post<TRoutePath extends Path & keyof TApi[TRouterPath]>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'post'>,
  ) {
    this.#on('post', path, requestHandler);
  }

  put<TRoutePath extends Path & keyof TApi[TRouterPath]>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath, 'put'>,
  ) {
    this.#on('put', path, requestHandler);
  }
}
