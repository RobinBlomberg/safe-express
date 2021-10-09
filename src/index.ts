import cookieParser from 'cookie-parser';
import express from 'express';
import { paramsParser, queryParser, requestBodyParser } from './middleware';
import {
  Method,
  Path,
  Props,
  RequestHandler,
  RequestParser,
  RouterSchema,
} from './types';

export class Router<TRouterSchema extends RouterSchema, TProps extends Props> {
  readonly parsers: RequestParser[];
  readonly router = express.Router();

  constructor(schema: TRouterSchema) {
    this.router.use(express.json());
    this.router.use(express.urlencoded({ extended: true }));
    this.router.use(cookieParser());

    this.parsers = [
      paramsParser(schema),
      queryParser(schema),
      requestBodyParser(schema),
    ];
  }

  #on<
    TMethod extends Method,
    TPath extends keyof TRouterSchema & Path,
    TRequestHandler extends RequestHandler<
      TPath,
      TRouterSchema[TPath][TMethod],
      TProps
    >,
  >(method: TMethod, path: TPath, originalRequestHandler: TRequestHandler) {
    const requestHandler: express.RequestHandler = (req, res, next) => {
      let headersSent = false;

      for (const parser of this.parsers) {
        headersSent = parser(req, res);

        if (headersSent) {
          break;
        }
      }

      if (!headersSent) {
        const returnee = originalRequestHandler(req as any, res, next);

        Promise.resolve(returnee).catch(next);
      }
    };

    this.router[method](path, requestHandler);
  }

  delete<TPath extends keyof TRouterSchema & Path>(
    path: TPath,
    requestHandler: RequestHandler<
      TPath,
      TRouterSchema[TPath]['delete'],
      TProps
    >,
  ) {
    this.#on('delete', path, requestHandler);
  }

  get<TPath extends keyof TRouterSchema & Path>(
    path: TPath,
    requestHandler: RequestHandler<TPath, TRouterSchema[TPath]['get'], TProps>,
  ) {
    this.#on('get', path, requestHandler);
  }

  head<TPath extends keyof TRouterSchema & Path>(
    path: TPath,
    requestHandler: RequestHandler<TPath, TRouterSchema[TPath]['head'], TProps>,
  ) {
    this.#on('head', path, requestHandler);
  }

  options<TPath extends keyof TRouterSchema & Path>(
    path: TPath,
    requestHandler: RequestHandler<
      TPath,
      TRouterSchema[TPath]['options'],
      TProps
    >,
  ) {
    this.#on('options', path, requestHandler);
  }

  patch<TPath extends keyof TRouterSchema & Path>(
    path: TPath,
    requestHandler: RequestHandler<
      TPath,
      TRouterSchema[TPath]['patch'],
      TProps
    >,
  ) {
    this.#on('patch', path, requestHandler);
  }

  post<TPath extends keyof TRouterSchema & Path>(
    path: TPath,
    requestHandler: RequestHandler<TPath, TRouterSchema[TPath]['post'], TProps>,
  ) {
    this.#on('post', path, requestHandler);
  }

  put<TPath extends keyof TRouterSchema & Path>(
    path: TPath,
    requestHandler: RequestHandler<TPath, TRouterSchema[TPath]['put'], TProps>,
  ) {
    this.#on('put', path, requestHandler);
  }

  use(handler: RequestHandler<Path, TRouterSchema[Path][Method], TProps>) {
    this.router.use(handler as express.RequestHandler);
  }
}
