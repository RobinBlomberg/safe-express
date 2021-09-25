import { AppOptions, ErrorRequestHandler, Method, RequestHandler, SafeRouter } from '.';
import { Api, Path } from './types';
export declare class SafeApp<TApi extends Api> {
    #private;
    constructor(options: AppOptions<TApi>);
    createRouter<TRouterPath extends Path & keyof TApi>(path: TRouterPath): SafeRouter<TApi, TRouterPath>;
    listen(port: number): this;
    useErrorRequestHandler(errorRequestHandler: ErrorRequestHandler): this;
    useRequestHandler(requestHandler: RequestHandler<Api, Path, Path, Method>): this;
    useRouter<TRouterPath extends Path & keyof TApi>(router: SafeRouter<TApi, TRouterPath>): this;
}
