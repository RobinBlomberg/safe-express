import { RouterApi } from '../..';
import { $newUser, $user } from '../services';
import { $array } from '../utils';

export type UserApi = RouterApi<typeof userApi>;

export const userApi = {
  '/': {
    get: {
      responseBody: $array($user),
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
