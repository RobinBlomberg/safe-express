import cookieParser from 'cookie-parser';
import express from 'express';
import {
  eson,
  paramsParser,
  queryParser,
  requestBodyParser,
} from './middleware';
import {
  ApiRequestHandler,
  Enumerable,
  Method,
  Path,
  Props,
  RequestHandler,
  RequestParser,
  RouterSchema,
} from './types';

export * from './types';

export class Router<RS extends RouterSchema, RP extends Props = {}> {
  readonly parsers: RequestParser[];
  readonly router = express.Router();

  constructor(schema: RS) {
    this.router.use(express.json());
    this.router.use(express.text({ type: 'application/javascript' }));
    this.router.use(express.urlencoded({ extended: true }));
    this.router.use(cookieParser());

    this.parsers = [
      eson(),
      paramsParser(schema),
      queryParser(schema),
      requestBodyParser(schema),
    ];
  }

  #on<
    M extends Method,
    P extends keyof RS & Path,
    RH extends ApiRequestHandler<P, RS[P][M], RP>,
  >(method: M, path: P, originalRequestHandler: RH): void;
  #on<
    M extends Method,
    P extends keyof RS & Path,
    RH extends ApiRequestHandler<P, RS[P][M], RP>,
  >(method: M, path: P, middleware: any, originalRequestHandler: RH): void;
  #on<
    M extends Method,
    P extends keyof RS & Path,
    RH extends ApiRequestHandler<P, RS[P][M], RP>,
  >(method: M, path: P, ...args: (Enumerable<RequestHandler> | RH)[]) {
    const middleware = args.slice(0, -1);
    const originalRequestHandler = args[args.length - 1] as RH;

    const requestHandler: RequestHandler = (req, res, next) => {
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

    this.router[method](path, ...(middleware as any), requestHandler as any);
  }

  delete<P extends keyof RS & Path>(
    path: P,
    requestHandler: ApiRequestHandler<P, RS[P]['delete'], RP>,
  ): void;
  delete<P extends keyof RS & Path>(
    path: P,
    middleware: any,
    requestHandler: ApiRequestHandler<P, RS[P]['delete'], RP>,
  ): void;
  delete<P extends keyof RS & Path>(
    path: P,
    ...args: (
      | ApiRequestHandler<P, RS[P]['delete'], RP>
      | Enumerable<RequestHandler>
    )[]
  ) {
    (this.#on as Function).call(this, 'delete', path, ...args);
  }

  get<P extends keyof RS & Path>(
    path: P,
    requestHandler: ApiRequestHandler<P, RS[P]['get'], RP>,
  ): void;
  get<P extends keyof RS & Path>(
    path: P,
    middleware: any,
    requestHandler: ApiRequestHandler<P, RS[P]['get'], RP>,
  ): void;
  get<P extends keyof RS & Path>(
    path: P,
    ...args: (
      | ApiRequestHandler<P, RS[P]['get'], RP>
      | Enumerable<RequestHandler>
    )[]
  ) {
    (this.#on as Function).call(this, 'get', path, ...args);
  }

  head<P extends keyof RS & Path>(
    path: P,
    requestHandler: ApiRequestHandler<P, RS[P]['head'], RP>,
  ): void;
  head<P extends keyof RS & Path>(
    path: P,
    middleware: any,
    requestHandler: ApiRequestHandler<P, RS[P]['head'], RP>,
  ): void;
  head<P extends keyof RS & Path>(
    path: P,
    ...args: (
      | ApiRequestHandler<P, RS[P]['head'], RP>
      | Enumerable<RequestHandler>
    )[]
  ) {
    (this.#on as Function).call(this, 'head', path, ...args);
  }

  options<P extends keyof RS & Path>(
    path: P,
    requestHandler: ApiRequestHandler<P, RS[P]['options'], RP>,
  ): void;
  options<P extends keyof RS & Path>(
    path: P,
    middleware: any,
    requestHandler: ApiRequestHandler<P, RS[P]['options'], RP>,
  ): void;
  options<P extends keyof RS & Path>(
    path: P,
    ...args: (
      | ApiRequestHandler<P, RS[P]['options'], RP>
      | Enumerable<RequestHandler>
    )[]
  ) {
    (this.#on as Function).call(this, 'options', path, ...args);
  }

  patch<P extends keyof RS & Path>(
    path: P,
    requestHandler: ApiRequestHandler<P, RS[P]['patch'], RP>,
  ): void;
  patch<P extends keyof RS & Path>(
    path: P,
    middleware: any,
    requestHandler: ApiRequestHandler<P, RS[P]['patch'], RP>,
  ): void;
  patch<P extends keyof RS & Path>(
    path: P,
    ...args: (
      | ApiRequestHandler<P, RS[P]['patch'], RP>
      | Enumerable<RequestHandler>
    )[]
  ) {
    (this.#on as Function).call(this, 'patch', path, ...args);
  }

  post<P extends keyof RS & Path>(
    path: P,
    requestHandler: ApiRequestHandler<P, RS[P]['post'], RP>,
  ): void;
  post<P extends keyof RS & Path>(
    path: P,
    middleware: any,
    requestHandler: ApiRequestHandler<P, RS[P]['post'], RP>,
  ): void;
  post<P extends keyof RS & Path>(
    path: P,
    ...args: (
      | ApiRequestHandler<P, RS[P]['post'], RP>
      | Enumerable<RequestHandler>
    )[]
  ) {
    (this.#on as Function).call(this, 'post', path, ...args);
  }

  put<P extends keyof RS & Path>(
    path: P,
    requestHandler: ApiRequestHandler<P, RS[P]['put'], RP>,
  ): void;
  put<P extends keyof RS & Path>(
    path: P,
    middleware: any,
    requestHandler: ApiRequestHandler<P, RS[P]['put'], RP>,
  ): void;
  put<P extends keyof RS & Path>(
    path: P,
    ...args: (
      | ApiRequestHandler<P, RS[P]['put'], RP>
      | Enumerable<RequestHandler>
    )[]
  ) {
    (this.#on as Function).call(this, 'put', path, ...args);
  }

  use(handler: ApiRequestHandler<Path, RS[Path][Method], RP>) {
    this.router.use(handler as any);
  }
}
