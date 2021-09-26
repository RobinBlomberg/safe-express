import { z as $ } from 'zod';
import { RouterApi } from '../..';
import { $newUser, $user } from '../services/user.schema';

export type UserApi = RouterApi<typeof userApi>;

export const userApi = {
  '/': {
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
