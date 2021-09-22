const { asyncHandler } = require('@robinblomberg/express-async-handler');
const cookieParser = require('cookie-parser');
const express = require('express');
const Safe = require('./types');

/**
 * @template {Safe.Api} TApi
 * @implements {SafeApp<TApi>}
 */
class SafeApp {
  /** @type {express.Express} */
  app;

  constructor() {
    this.app = express();

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  /**
   * @template {Safe.EndpointOf<TApi>} TEndpoint
   * @param {Safe.RequestHandler<TApi, TEndpoint>} requestHandler
   */
  createController(requestHandler) {
    return /** @type {Safe.RequestHandler<TApi, TEndpoint>} */ (
      asyncHandler(requestHandler)
    );
  }

  /**
   * @template {Safe.Path} TBasePath
   */
  createRouter() {
    const router = /** @type {Safe.Router<TApi, TBasePath>} */ (
      /** @type {unknown} */ (express.Router())
    );

    router.on = (target, ...handlers) => {
      const tokens = target.split(' ');
      const method = /** @type {Safe.RouterFunctionName} */ (
        tokens[0].toLowerCase()
      );
      const path = /** @type {Safe.Path} */ (tokens[1]);

      router[method](path, ...handlers);
    };

    return router;
  }

  /**
   * @param {number} port
   * @param {() => void} [callback]
   */
  listen(port, callback) {
    return this.app.listen(Number(port), callback);
  }

  /**
   * @param {any[]} args
   */
  use(...args) {
    this.app.use(...args);
  }
}

module.exports = {
  Safe,
  SafeApp,
};
