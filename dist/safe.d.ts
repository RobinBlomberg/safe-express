import { Api, AppOptions, Path, SafeApp, SafeRouter } from '.';
export declare const safe: {
    createApp: <TApi extends Api>(options: AppOptions<TApi>) => SafeApp<TApi>;
    createRouter: <TApi_1 extends Api, TRouterPath extends Path & keyof TApi_1 = Path & keyof TApi_1>(api: TApi_1, path: TRouterPath) => SafeRouter<TApi_1, TRouterPath>;
};
