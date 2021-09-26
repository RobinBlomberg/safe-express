import { status, statusText } from '@robinblomberg/http-status';
import express from 'express';
import { RouteParameters } from 'express-serve-static-core';
import {
  ApiRequestHandler,
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
    args: any[],
  ) {
    const middleware: RequestHandler[] = args[1] ? args[0] : [];
    const requestHandler: ApiRequestHandler<TApi, TMethod, TRoutePath> =
      args[1] ?? args[0];

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
          res.status(status.clientError.BAD_REQUEST);
          res.json(result.error.errors);
          return;
        }
      }

      try {
        let responseBody;

        for (const handler of [...middleware, requestHandler]) {
          // eslint-disable-next-line no-await-in-loop
          responseBody = await Promise.resolve(handler(req, res, next));
        }

        res.json(responseBody ?? null);
      } catch (error) {
        if (error instanceof RequestError) {
          res.status(error.status);
          res.json({
            code: error.code,
          });
        } else if (
          error instanceof SyntaxError &&
          (error as BodyParserError).type === 'entity.parse.failed'
        ) {
          res.status(status.clientError.BAD_REQUEST);
          res.json('Expected request body to be an object or array.');
        } else {
          console.error(error);
          res.status(status.serverError.INTERNAL_SERVER_ERROR);
          res.json(statusText[status.serverError.INTERNAL_SERVER_ERROR]);
        }
      }
    });
  }

  delete<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: ApiRequestHandler<TApi, 'delete', TRoutePath>,
  ): void;
  delete<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: RequestHandler[],
    requestHandler: ApiRequestHandler<TApi, 'delete', TRoutePath>,
  ): void;
  delete<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    ...args: any[]
  ) {
    this.#on('delete', path, args);
  }

  get<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: ApiRequestHandler<TApi, 'get', TRoutePath>,
  ): void;
  get<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: RequestHandler[],
    requestHandler: ApiRequestHandler<TApi, 'get', TRoutePath>,
  ): void;
  get<TRoutePath extends Path & keyof TApi>(path: TRoutePath, ...args: any[]) {
    this.#on('get', path, args);
  }

  head<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: ApiRequestHandler<TApi, 'head', TRoutePath>,
  ): void;
  head<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: RequestHandler[],
    requestHandler: ApiRequestHandler<TApi, 'head', TRoutePath>,
  ): void;
  head<TRoutePath extends Path & keyof TApi>(path: TRoutePath, ...args: any[]) {
    this.#on('head', path, args);
  }

  options<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: ApiRequestHandler<TApi, 'options', TRoutePath>,
  ): void;
  options<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: RequestHandler[],
    requestHandler: ApiRequestHandler<TApi, 'options', TRoutePath>,
  ): void;
  options<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    ...args: any[]
  ) {
    this.#on('options', path, args);
  }

  patch<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: ApiRequestHandler<TApi, 'patch', TRoutePath>,
  ): void;
  patch<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: RequestHandler[],
    requestHandler: ApiRequestHandler<TApi, 'patch', TRoutePath>,
  ): void;
  patch<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    ...args: any[]
  ) {
    this.#on('patch', path, args);
  }

  post<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: ApiRequestHandler<TApi, 'post', TRoutePath>,
  ): void;
  post<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: RequestHandler[],
    requestHandler: ApiRequestHandler<TApi, 'post', TRoutePath>,
  ): void;
  post<TRoutePath extends Path & keyof TApi>(path: TRoutePath, ...args: any[]) {
    this.#on('post', path, args);
  }

  put<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: ApiRequestHandler<TApi, 'put', TRoutePath>,
  ): void;
  put<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: RequestHandler[],
    requestHandler: ApiRequestHandler<TApi, 'put', TRoutePath>,
  ): void;
  put<TRoutePath extends Path & keyof TApi>(path: TRoutePath, ...args: any[]) {
    this.#on('put', path, args);
  }
}
