import express from 'express';
import { RouteParameters } from 'express-serve-static-core';
import {
  BodyParserError,
  Locals,
  Method,
  Path,
  Query,
  RequestBodyOf,
  RequestError,
  RequestHandler,
  ResponseBodyOf,
  RouterApi,
  status,
} from '.';

export class SafeRouter<TApi extends RouterApi> {
  readonly api: TApi;
  readonly router: express.Router;

  constructor(api: TApi) {
    this.api = api;
    this.router = express.Router();
  }

  #on<TRoutePath extends Path & keyof TApi, TMethod extends Method>(
    method: TMethod,
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, TMethod, TRoutePath>,
  ) {
    this.router[method]<
      TRoutePath,
      RouteParameters<TRoutePath>,
      ResponseBodyOf<TApi, TMethod, TRoutePath>,
      RequestBodyOf<TApi, TMethod, TRoutePath>,
      Query,
      Locals
    >(path, async (req, res, next) => {
      const schema = this.api[path]?.[method]?.requestBody;
      if (schema) {
        const result = schema.safeParse(req.body);
        if (!result.success) {
          res.status(status.BAD_REQUEST);
          res.json(result.error.errors);
          return;
        }
      }

      try {
        const responseBody = await Promise.resolve(
          requestHandler(req, res, next),
        );

        res.json(responseBody ?? null);
      } catch (error: unknown) {
        if (error instanceof RequestError) {
          res.status(error.status);
          res.json({
            code: error.code,
          });
        } else if (
          error instanceof SyntaxError &&
          (error as BodyParserError).type === 'entity.parse.failed'
        ) {
          res.status(status.BAD_REQUEST);
          res.json('Expected request body to be an object or array.');
        } else {
          console.error(error);
          res.status(status.INTERNAL_SERVER_ERROR);
          res.json(status[status.INTERNAL_SERVER_ERROR]);
        }
      }
    });
  }

  delete<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, 'delete', TRoutePath>,
  ) {
    this.#on('delete', path, requestHandler);
  }

  get<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, 'get', TRoutePath>,
  ) {
    this.#on('get', path, requestHandler);
  }

  head<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, 'head', TRoutePath>,
  ) {
    this.#on('head', path, requestHandler);
  }

  options<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, 'options', TRoutePath>,
  ) {
    this.#on('options', path, requestHandler);
  }

  patch<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, 'patch', TRoutePath>,
  ) {
    this.#on('patch', path, requestHandler);
  }

  post<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, 'post', TRoutePath>,
  ) {
    this.#on('post', path, requestHandler);
  }

  put<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, 'put', TRoutePath>,
  ) {
    this.#on('put', path, requestHandler);
  }
}
