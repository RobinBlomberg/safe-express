import express from 'express';
import { RequestHandler, RouterSchema } from './types';

export class Router<TRouterSchema extends RouterSchema> {
  readonly #router: express.Router;

  constructor() {
    this.#router = express.Router();
  }

  post<TPath extends keyof TRouterSchema & string>(
    path: TPath,
    requestHandler: RequestHandler<TRouterSchema[TPath]['post']>,
  ) {
    this.#router.get(path, requestHandler);
  }
}
