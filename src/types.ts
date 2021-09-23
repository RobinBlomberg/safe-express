import { CorsOptions } from 'cors';
import {
  NextFunction as ExpressNextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express-serve-static-core';

export type Api = {
  errors: ErrorResponseBody;
  props: Props;
  routes: Routes;
};

export type ApiDefinition<TApi extends Api> = TApi;

export type Controller<TApi extends Api, TEndpoint extends EndpointOf<TApi>> = (
  requestHandler: SafeRequestHandler<TApi, TEndpoint>
) => SafeRequestHandler<TApi, TEndpoint>;

export type Endpoint = `${Method} ${Path}`;

export type EndpointOf<TApi extends Api> = keyof TApi['routes'];

export type ErrorResponseBody = {
  [K in string]?: unknown;
};

export type ErrorResponseBodyOf<TApi extends Api> = TApi['errors'];

export type Method =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT';

export type Params = {
  [K in string]?: string;
};

export type ParamsOf<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = RouteOf<TApi, TEndpoint>['params'];

export type Path = `/${string}`;

export type Props = {
  [K in string]?: unknown;
};

export type PropsOf<TApi extends Api> = TApi['props'];

export type Route = {
  from?: unknown;
  params?: Params;
  query?: Query;
  to: unknown;
};

export type RouteOf<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = Route & TApi['routes'][TEndpoint];

export type Router<
  TApi extends Api,
  TBasePath extends Path
> = SafeRequestHandler<TApi, EndpointOf<TApi>> & {
  on: <TEndpoint extends `${Method} ${TBasePath}${string}` & EndpointOf<TApi>>(
    endpoint: TEndpoint,
    ...handlers: SafeRequestHandler<TApi, TEndpoint>[]
  ) => void;
};

export type RouterFunctionName =
  | 'delete'
  | 'get'
  | 'head'
  | 'options'
  | 'patch'
  | 'post'
  | 'put';

export type Routes = {
  [K in Endpoint]: Route;
};

export type Query = {
  [K in string]?: string | string[] | Query | Query[];
};

export type QueryOf<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = RouteOf<TApi, TEndpoint>['query'];

export type SafeAppOptions = {
  cors?: CorsOptions;
  debug?: boolean;
};

export type SafeRequest<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = ExpressRequest<
  ParamsOf<TApi, TEndpoint>,
  SafeResponseBodyOf<TApi, TEndpoint>,
  SafeRequestBodyOf<TApi, TEndpoint>,
  QueryOf<TApi, TEndpoint>
> &
  PropsOf<TApi>;

export type SafeRequestBodyOf<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = RouteOf<TApi, TEndpoint>['from'];

export type SafeRequestHandler<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = (
  req: SafeRequest<TApi, TEndpoint>,
  res: SafeResponse<TApi, TEndpoint>,
  next: ExpressNextFunction
) => void;

export type SafeResponse<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = ExpressResponse<SafeResponseBodyOf<TApi, TEndpoint>>;

export type SafeResponseBodyOf<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = RouteOf<TApi, TEndpoint>['to'] | ErrorResponseBodyOf<TApi>;
