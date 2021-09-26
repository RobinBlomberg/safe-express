import { AppOptions } from '../../types';
import { testApi, TestApi } from '../apis/api';
import { logger } from '../utils/logger';

export const appConfig: AppOptions<TestApi> = {
  api: testApi,
  cors: {
    credentials: true,
  },
  log: logger.http.stringify,
};
