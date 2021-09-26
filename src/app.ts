import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { AppOptions, SafeRouter } from '.';
import { logger } from './internal/logger';
import { Api } from './types';

export class SafeApp<TApi extends Api> {
  readonly #app: express.Express;

  constructor(options: AppOptions<TApi>) {
    this.#app = express();

    if (options.log) {
      this.useMiddleware(
        logger(typeof options.log === 'boolean' ? undefined : options.log),
      );
    }

    this.useMiddleware(express.json());
    this.useMiddleware(express.urlencoded({ extended: true }));
    this.useMiddleware(cookieParser());
    this.useMiddleware(cors(options.cors));
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

  useMiddleware(requestHandler: express.RequestHandler) {
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
