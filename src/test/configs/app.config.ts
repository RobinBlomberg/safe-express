import { AppOptions } from '../..';
import { TestApi, testApi } from '../apis';
import { logger } from '../utils';

export const appConfig: AppOptions<TestApi> = {
  api: testApi,
  cors: {
    credentials: true,
  },
  log: logger.http.stringify,
};
