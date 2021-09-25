import { Api } from '../..';
import { userApi } from './user.api';

const api = {
  '/api/v1/user': userApi,
};

export type TestApi = Api & typeof api;

export const testApi = api as TestApi;
