import { $array, $unknown } from '@robinblomberg/zod';
import { $newUser, $user } from '../services/user.schema';

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
  '/me': {
    get: {
      responseBody: $unknown,
    },
  },
};
