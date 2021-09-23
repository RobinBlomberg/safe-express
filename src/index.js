const { asyncHandler } = require('@robinblomberg/express-async-handler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const Safe = require('./types');

/**
 * @template {Safe.Api} TApi
 * @implements {SafeApp<TApi>}
 */
class SafeApp {
  /** @type {express.Express} */
  app;

  /**
   * @param {Safe.SafeAppOptions} options
   */
  constructor(options) {
    this.app = express();

    if (options.debug) {
      this.app.use(morgan('dev'));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(cors(options.cors));
  }

  /**
   * @template {Safe.EndpointOf<TApi>} TEndpoint
   * @param {Safe.SafeRequestHandler<TApi, TEndpoint>} requestHandler
   */
  createController(requestHandler) {
    return asyncHandler(/** @type {*} */ (requestHandler));
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
   * @param {Parameters<import('express-serve-static-core').ApplicationRequestHandler<void>>} args
   */
  use(...args) {
    this.app.use(...args);
  }
}

module.exports = {
  Safe,
  SafeApp,
};
