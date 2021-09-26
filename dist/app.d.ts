import { AppOptions, ErrorRequestHandler, Method, RequestHandler, SafeRouter } from '.';
import { Api, Path } from './types';
export declare class SafeApp<TApi extends Api> {
    #private;
    constructor(options: AppOptions<TApi>);
    listen(port: number): this;
    useErrorRequestHandler(errorRequestHandler: ErrorRequestHandler): this;
    useRequestHandler(requestHandler: RequestHandler<Api, Method, Path>): this;
    useRouter<TRouterPath extends keyof TApi & string>(path: TRouterPath, router: SafeRouter<TApi[TRouterPath]>): this;
}
