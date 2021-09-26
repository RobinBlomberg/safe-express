import { $newUser, $user } from '../services/user.schema';
import { $array } from '../utils/schema';

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
