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
  requestHandler: RequestHandler<TApi, TEndpoint>
) => RequestHandler<TApi, TEndpoint>;

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

export type RequestBodyOf<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = RouteOf<TApi, TEndpoint>['from'];

export type Request<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = ExpressRequest<
  ParamsOf<TApi, TEndpoint>,
  ResponseBodyOf<TApi, TEndpoint>,
  RequestBodyOf<TApi, TEndpoint>,
  QueryOf<TApi, TEndpoint>
> &
  PropsOf<TApi>;

export type RequestHandler<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = (
  req: Request<TApi, TEndpoint>,
  res: Response<TApi, TEndpoint>,
  next: ExpressNextFunction
) => void;

export type RequestHandlerArray<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi> = EndpointOf<TApi>
> = [RequestHandler<TApi, TEndpoint>, ...RequestHandler<TApi, TEndpoint>[]];

export type Response<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = ExpressResponse<ResponseBodyOf<TApi, TEndpoint>>;

export type ResponseBodyOf<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = RouteOf<TApi, TEndpoint>['to'] | ErrorResponseBodyOf<TApi>;

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

export type Router<TApi extends Api, TBasePath extends Path> = RequestHandler<
  TApi,
  EndpointOf<TApi>
> & {
  on: <TEndpoint extends `${Method} ${TBasePath}${string}` & EndpointOf<TApi>>(
    endpoint: TEndpoint,
    ...handlers: RequestHandler<TApi, TEndpoint>[]
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
  [K in string]?: string;
};

export type QueryOf<
  TApi extends Api,
  TEndpoint extends EndpointOf<TApi>
> = RouteOf<TApi, TEndpoint>['query'];
