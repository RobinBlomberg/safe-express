import { Express } from 'express-serve-static-core';
import * as http from 'http';
import * as Safe from './types';

export { Safe };

export class SafeApp<TApi extends Safe.Api> {
  createController<TEndpoint extends Safe.EndpointOf<TApi>>(
    requestHandler: Safe.RequestHandler<TApi, TEndpoint>
  ): Safe.RequestHandler<TApi, TEndpoint>;
  createRouter<TBasePath extends Safe.Path>(): Safe.Router<TApi, TBasePath>;
  listen(port: number, callback?: () => void): http.Server;
  use(...handlers: Safe.RequestHandlerArray<TApi>): Express;
  use(path: string, ...handlers: Safe.RequestHandlerArray<TApi>): Express;
}
