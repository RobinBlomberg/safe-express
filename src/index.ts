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

export * from './types';

export class Router<RS extends RouterSchema, RP extends Props> {
  readonly parsers: RequestParser[];
  readonly router = express.Router();

  constructor(schema: RS) {
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
    M extends Method,
    P extends keyof RS & Path,
    RH extends RequestHandler<P, RS[P][M], RP>,
  >(method: M, path: P, originalRequestHandler: RH): void;
  #on<
    M extends Method,
    P extends keyof RS & Path,
    RH extends RequestHandler<P, RS[P][M], RP>,
  >(
    method: M,
    path: P,
    middleware: express.RequestHandler[],
    originalRequestHandler: RH,
  ): void;
  #on<
    M extends Method,
    P extends keyof RS & Path,
    RH extends RequestHandler<P, RS[P][M], RP>,
  >(method: M, path: P, ...args: (express.RequestHandler[] | RH)[]) {
    const middleware = args.slice(0, -1) as express.RequestHandler[];
    const originalRequestHandler = args[args.length - 1] as RH;

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

    this.router[method](path, ...middleware, requestHandler);
  }

  delete<P extends keyof RS & Path>(
    path: P,
    requestHandler: RequestHandler<P, RS[P]['delete'], RP>,
  ): void;
  delete<P extends keyof RS & Path>(
    path: P,
    middleware: express.RequestHandler[],
    requestHandler: RequestHandler<P, RS[P]['delete'], RP>,
  ): void;
  delete<P extends keyof RS & Path>(
    path: P,
    ...args: (
      | RequestHandler<P, RS[P]['delete'], RP>
      | express.RequestHandler[]
    )[]
  ) {
    (this.#on as Function).call(this, 'delete', path, ...args);
  }

  get<P extends keyof RS & Path>(
    path: P,
    requestHandler: RequestHandler<P, RS[P]['get'], RP>,
  ): void;
  get<P extends keyof RS & Path>(
    path: P,
    middleware: express.RequestHandler[],
    requestHandler: RequestHandler<P, RS[P]['get'], RP>,
  ): void;
  get<P extends keyof RS & Path>(
    path: P,
    ...args: (RequestHandler<P, RS[P]['get'], RP> | express.RequestHandler[])[]
  ) {
    (this.#on as Function).call(this, 'get', path, ...args);
  }

  head<P extends keyof RS & Path>(
    path: P,
    requestHandler: RequestHandler<P, RS[P]['head'], RP>,
  ): void;
  head<P extends keyof RS & Path>(
    path: P,
    middleware: express.RequestHandler[],
    requestHandler: RequestHandler<P, RS[P]['head'], RP>,
  ): void;
  head<P extends keyof RS & Path>(
    path: P,
    ...args: (RequestHandler<P, RS[P]['head'], RP> | express.RequestHandler[])[]
  ) {
    (this.#on as Function).call(this, 'head', path, ...args);
  }

  options<P extends keyof RS & Path>(
    path: P,
    requestHandler: RequestHandler<P, RS[P]['options'], RP>,
  ): void;
  options<P extends keyof RS & Path>(
    path: P,
    middleware: express.RequestHandler[],
    requestHandler: RequestHandler<P, RS[P]['options'], RP>,
  ): void;
  options<P extends keyof RS & Path>(
    path: P,
    ...args: (
      | RequestHandler<P, RS[P]['options'], RP>
      | express.RequestHandler[]
    )[]
  ) {
    (this.#on as Function).call(this, 'options', path, ...args);
  }

  patch<P extends keyof RS & Path>(
    path: P,
    requestHandler: RequestHandler<P, RS[P]['patch'], RP>,
  ): void;
  patch<P extends keyof RS & Path>(
    path: P,
    middleware: express.RequestHandler[],
    requestHandler: RequestHandler<P, RS[P]['patch'], RP>,
  ): void;
  patch<P extends keyof RS & Path>(
    path: P,
    ...args: (
      | RequestHandler<P, RS[P]['patch'], RP>
      | express.RequestHandler[]
    )[]
  ) {
    (this.#on as Function).call(this, 'patch', path, ...args);
  }

  post<P extends keyof RS & Path>(
    path: P,
    requestHandler: RequestHandler<P, RS[P]['post'], RP>,
  ): void;
  post<P extends keyof RS & Path>(
    path: P,
    middleware: express.RequestHandler[],
    requestHandler: RequestHandler<P, RS[P]['post'], RP>,
  ): void;
  post<P extends keyof RS & Path>(
    path: P,
    ...args: (RequestHandler<P, RS[P]['post'], RP> | express.RequestHandler[])[]
  ) {
    (this.#on as Function).call(this, 'post', path, ...args);
  }

  put<P extends keyof RS & Path>(
    path: P,
    requestHandler: RequestHandler<P, RS[P]['put'], RP>,
  ): void;
  put<P extends keyof RS & Path>(
    path: P,
    middleware: express.RequestHandler[],
    requestHandler: RequestHandler<P, RS[P]['put'], RP>,
  ): void;
  put<P extends keyof RS & Path>(
    path: P,
    ...args: (RequestHandler<P, RS[P]['put'], RP> | express.RequestHandler[])[]
  ) {
    (this.#on as Function).call(this, 'put', path, ...args);
  }

  use(handler: RequestHandler<Path, RS[Path][Method], RP>) {
    this.router.use(handler as express.RequestHandler);
  }
}
