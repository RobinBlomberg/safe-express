import { z as $ } from 'zod';
import { RouterApi } from '../..';
import { $newUser, $user } from '../services/user.schema';

const api = {
  '': {
    get: {
      responseBody: $.array($user),
    },
    post: {
      requestBody: $newUser,
      responseBody: $user,
    },
  },
  '/:id': {
    get: {
      responseBody: $user,
    },
  },
};

export type UserApi = RouterApi & typeof api;

export const userApi = api as UserApi;
