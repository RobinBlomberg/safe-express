import { z } from 'zod';
import { $newUser, $user } from './user-schemas';

export type UserApi = typeof userApi;

export const userApi = {
  '/': {
    get: {
      query: z
        .object({
          ids: z.array(z.number()).optional(),
          names: z.array(z.string()).optional(),
        })
        .optional(),
      responseBody: z.array($user),
    },
    post: {
      requestBody: $newUser,
      responseBody: $user,
    },
  },
  '/:id': {
    get: {
      params: z.strictObject({
        id: z.string().transform(Number),
      }),
      responseBody: $user,
      responseError: z.literal('User not found'),
    },
  },
  '/date': {
    get: {
      query: z.date(),
      responseBody: z.date(),
    },
  },
  '/me': {
    get: {
      responseBody: $user,
    },
  },
};
