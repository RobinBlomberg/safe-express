import { RouterApi, SafeRouter } from '../..';
import { routerOptions } from '../configs/router-options.config';

export type TestRequestData = {
  cookies: Record<string, string>;
  user: {
    id: number;
    name: string;
    role: 'ADMIN' | 'READER';
  };
};

export class TestRouter<TApi extends RouterApi> extends SafeRouter<
  TApi,
  TestRequestData
> {
  constructor(api: TApi) {
    super(api, routerOptions);
  }
}
