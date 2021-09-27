import { status, statusText } from '@robinblomberg/http-status';
import express from 'express';
import { RouteParameters } from 'express-serve-static-core';
import {
  ApiRequestHandler,
  BodyParserError,
  Locals,
  Method,
  Middleware,
  Path,
  Query,
  Request,
  RequestBodyOf,
  RequestData,
  RequestError,
  ResponseBodyOf,
  RouterApi,
  SafeRouterOptions,
} from '.';

export class SafeRouter<
  TApi extends RouterApi,
  TData extends RequestData = RequestData,
> {
  readonly api: TApi;
  readonly middleware: Middleware<TData>[];
  readonly router: express.Router;

  constructor(api: TApi, options: SafeRouterOptions<TData> = {}) {
    this.api = api;
    this.middleware = options.middleware ?? [];
    this.router = express.Router();
  }

  #on<TRoutePath extends Path & keyof TApi, TMethod extends Method>(
    method: TMethod,
    path: TRoutePath,
    args: any[],
  ) {
    const middleware: Middleware<TData>[] = args[1] ? args[0] : [];
    const requestHandler: ApiRequestHandler<TApi, TMethod, TRoutePath, TData> =
      args[1] ?? args[0];

    this.router[method]<
      TRoutePath,
      RouteParameters<TRoutePath>,
      ResponseBodyOf<TApi, TMethod, TRoutePath>,
      RequestBodyOf<TApi, TMethod, TRoutePath>,
      Query,
      Locals
    >(path, async (originalReq, res, next) => {
      const schema = this.api[path]?.[method]?.requestBody;
      if (schema) {
        const result = schema.safeParse(originalReq.body);
        if (!result.success) {
          res.status(status.clientError.BAD_REQUEST);
          res.json(result.error.errors);
          return;
        }
      }

      const req = originalReq as Request<
        RouteParameters<TRoutePath>,
        ResponseBodyOf<TApi, TMethod, TRoutePath>,
        RequestBodyOf<TApi, TMethod, TRoutePath>,
        Query,
        Locals,
        TData
      >;

      req.data = {} as TData;

      try {
        const handlers = [...this.middleware, ...middleware, requestHandler];
        let responseBody;

        for (const handler of handlers) {
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
    requestHandler: ApiRequestHandler<TApi, 'delete', TRoutePath, TData>,
  ): void;
  delete<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: Middleware<TData>,
    requestHandler: ApiRequestHandler<TApi, 'delete', TRoutePath, TData>,
  ): void;
  delete<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    ...args: any[]
  ) {
    this.#on('delete', path, args);
  }

  get<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: ApiRequestHandler<TApi, 'get', TRoutePath, TData>,
  ): void;
  get<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: Middleware<TData>[],
    requestHandler: ApiRequestHandler<TApi, 'get', TRoutePath, TData>,
  ): void;
  get<TRoutePath extends Path & keyof TApi>(path: TRoutePath, ...args: any[]) {
    this.#on('get', path, args);
  }

  head<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: ApiRequestHandler<TApi, 'head', TRoutePath, TData>,
  ): void;
  head<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: Middleware<TData>[],
    requestHandler: ApiRequestHandler<TApi, 'head', TRoutePath, TData>,
  ): void;
  head<TRoutePath extends Path & keyof TApi>(path: TRoutePath, ...args: any[]) {
    this.#on('head', path, args);
  }

  options<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: ApiRequestHandler<TApi, 'options', TRoutePath, TData>,
  ): void;
  options<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: Middleware<TData>[],
    requestHandler: ApiRequestHandler<TApi, 'options', TRoutePath, TData>,
  ): void;
  options<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    ...args: any[]
  ) {
    this.#on('options', path, args);
  }

  patch<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: ApiRequestHandler<TApi, 'patch', TRoutePath, TData>,
  ): void;
  patch<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: Middleware<TData>[],
    requestHandler: ApiRequestHandler<TApi, 'patch', TRoutePath, TData>,
  ): void;
  patch<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    ...args: any[]
  ) {
    this.#on('patch', path, args);
  }

  post<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: ApiRequestHandler<TApi, 'post', TRoutePath, TData>,
  ): void;
  post<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: Middleware<TData>[],
    requestHandler: ApiRequestHandler<TApi, 'post', TRoutePath, TData>,
  ): void;
  post<TRoutePath extends Path & keyof TApi>(path: TRoutePath, ...args: any[]) {
    this.#on('post', path, args);
  }

  put<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    requestHandler: ApiRequestHandler<TApi, 'put', TRoutePath, TData>,
  ): void;
  put<TRoutePath extends Path & keyof TApi>(
    path: TRoutePath,
    middleware: Middleware<TData>[],
    requestHandler: ApiRequestHandler<TApi, 'put', TRoutePath, TData>,
  ): void;
  put<TRoutePath extends Path & keyof TApi>(path: TRoutePath, ...args: any[]) {
    this.#on('put', path, args);
  }
}
