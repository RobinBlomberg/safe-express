import { Api } from '../../types';
import { userApi } from './user.api';

export type TestApi = Api<typeof testApi>;

export const testApi = {
  '/api/v1/user': userApi,
};
