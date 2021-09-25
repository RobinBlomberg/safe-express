import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import {
  AppOptions,
  ErrorRequestHandler,
  Method,
  RequestHandler,
  SafeRouter,
} from '.';
import { logger } from './logger';
import { Api, Path } from './types';

export class SafeApp<TApi extends Api> {
  readonly #api: TApi;
  readonly #app: express.Express;

  constructor(options: AppOptions<TApi>) {
    this.#api = options.api;
    this.#app = express();

    if (options.log) {
      this.#app.use(
        logger(typeof options.log === 'boolean' ? undefined : options.log),
      );
    }

    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(cookieParser());
    this.#app.use(cors(options.cors));
  }

  createRouter<TRouterPath extends Path & keyof TApi>(path: TRouterPath) {
    return new SafeRouter<TApi, TRouterPath>(this.#api, path);
  }

  listen(port: number) {
    this.#app.listen(port);

    return this;
  }

  useErrorRequestHandler(errorRequestHandler: ErrorRequestHandler) {
    const handler: express.ErrorRequestHandler = (
      error,
      request,
      response,
      next,
    ) => {
      return errorRequestHandler({
        error,
        next,
        request,
        response,
      });
    };
    this.#app.use(handler);

    return this;
  }

  useRequestHandler(requestHandler: RequestHandler<Api, Path, Path, Method>) {
    const handler: express.RequestHandler = (request, response, next) => {
      return requestHandler({
        api: this.#api,
        next,
        request,
        response,
      });
    };
    this.#app.use(handler);

    return this;
  }

  useRouter<TRouterPath extends Path & keyof TApi>(
    router: SafeRouter<TApi, TRouterPath>,
  ) {
    this.#app.use(router.path, router.router);

    return this;
  }
}
