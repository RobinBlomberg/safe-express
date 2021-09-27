import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { AppOptions, RequestHandler, SafeRouter } from '.';
import { logger } from './internal/logger';
import { Api } from './types';

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

  listen(port: number | string, callback?: () => void) {
    this.#app.listen(port);
    callback?.();

    return this;
  }

  useErrorRequestHandler(errorRequestHandler: express.ErrorRequestHandler) {
    this.#app.use(errorRequestHandler);

    return this;
  }

  useRouter<
    TRouterPath extends keyof TApi & string,
    TMiddleware extends RequestHandler[],
  >(path: TRouterPath, router: SafeRouter<TApi[TRouterPath], TMiddleware>) {
    this.#app.use(path, router.router);

    return this;
  }
}
