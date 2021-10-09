import { z } from 'zod';
import { $newUser, $user } from './user-schemas';

export const userApi = {
  '/': {
    get: {
      query: z.object({
        name: z.string().optional(),
      }),
      responseBody: z.array($user),
    },
    post: {
      requestBody: $newUser,
      responseBody: $user,
    },
  },
  '/:id': {
    get: {
      params: z.object({
        id: z.string().transform(Number),
      }),
      responseBody: $user.nullable(),
    },
  },
};
