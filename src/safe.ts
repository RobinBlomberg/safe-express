import { Api, AppOptions, Path, SafeApp, SafeRouter } from '.';

export const safe = {
  createApp: <TApi extends Api>(options: AppOptions<TApi>) => {
    return new SafeApp(options);
  },
  createRouter: <
    TApi extends Api,
    TRouterPath extends Path & keyof TApi = Path & keyof TApi,
  >(
    api: TApi,
    path: TRouterPath,
  ) => {
    return new SafeRouter(api, path);
  },
};
