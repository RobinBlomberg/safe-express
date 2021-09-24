import express from 'express';
import { RouteParameters } from 'express-serve-static-core';
import {
  Api,
  Locals,
  Path,
  Query,
  RequestBodyOf,
  RequestHandler,
  ResponseBodyOf,
} from './types';

export class App<TApi extends Api> {
  api: TApi;
  app: express.Express;

  constructor(api: TApi) {
    this.api = api;
    this.app = express();
  }

  createRouter<TRoutePath extends Path & keyof TApi>(path: TRoutePath) {
    return new Router<TApi, TRoutePath>(path);
  }
}

export class Router<TApi extends Api, TRouterPath extends Path> {
  path: TRouterPath;
  router: express.Router;

  constructor(path: TRouterPath) {
    this.path = path;
    this.router = express.Router();
  }

  get<TRoutePath extends Path & keyof TApi[TRouterPath]>(
    path: TRoutePath,
    requestHandler: RequestHandler<TApi, TRouterPath, TRoutePath>
  ) {
    this.router.get<
      TRoutePath,
      RouteParameters<TRoutePath>,
      ResponseBodyOf<TApi, TRouterPath, TRoutePath>,
      RequestBodyOf<TApi, TRouterPath, TRoutePath>,
      Query,
      Locals
    >(path, async (req, res) => {
      const responseBody = await requestHandler(req, res);
      res.json(responseBody);
    });
  }
}
