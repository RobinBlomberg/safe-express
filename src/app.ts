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
  readonly #app: express.Express;

  constructor(options: AppOptions<TApi>) {
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

  listen(port: number) {
    this.#app.listen(port);

    return this;
  }

  useErrorRequestHandler(errorRequestHandler: ErrorRequestHandler) {
    this.#app.use(errorRequestHandler);

    return this;
  }

  useRequestHandler(requestHandler: RequestHandler<Api, Method, Path>) {
    this.#app.use(requestHandler);

    return this;
  }

  useRouter<TRouterPath extends keyof TApi & string>(
    path: TRouterPath,
    router: SafeRouter<TApi[TRouterPath]>,
  ) {
    this.#app.use(path, router.router);

    return this;
  }
}
