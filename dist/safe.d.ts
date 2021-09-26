import { Api, AppOptions, SafeApp, SafeRouter } from '.';
export declare const safe: {
    createApp: <TApi extends Api>(options: AppOptions<TApi>) => SafeApp<TApi>;
    createRouter: <TApi_1 extends Api>(api: TApi_1) => SafeRouter<TApi_1>;
};
