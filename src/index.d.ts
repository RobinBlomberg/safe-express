import { ApplicationRequestHandler } from 'express-serve-static-core';
import * as http from 'http';
import * as Safe from './types';

export { CookieOptions, ErrorRequestHandler } from 'express-serve-static-core';
export { Safe };

export class SafeApp<TApi extends Safe.Api> {
  createController<TEndpoint extends Safe.EndpointOf<TApi>>(
    requestHandler: Safe.SafeRequestHandler<TApi, TEndpoint>
  ): Safe.SafeRequestHandler<TApi, TEndpoint>;
  createRouter<TBasePath extends Safe.Path>(): Safe.Router<TApi, TBasePath>;
  listen(port: number | string, callback?: () => void): http.Server;
  use: ApplicationRequestHandler<void>;
}
