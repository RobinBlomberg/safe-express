import { z } from 'zod';
import { $newUser, $user } from './user-schemas';

export type UserApi = typeof userApi;

export const userApi = {
  '/': {
    get: {
      query: z
        .object({
          ids: z.number().array().optional(),
          names: z.string().array().optional(),
        })
        .optional(),
      responseBody: $user.array(),
    },
    post: {
      requestBody: $newUser,
      responseBody: $user,
    },
  },
  '/:id': {
    get: {
      params: {
        id: z.number(),
      },
      responseBody: $user,
      responseError: z.literal('User not found'),
    },
  },
  '/:id/:id2': {
    get: {
      params: {
        id: z.number(),
        id2: z.string(),
      },
      responseBody: z.strictObject({
        id: z.number(),
        id2: z.string(),
      }),
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
  '/me2': {
    get: {
      responseBody: $user,
    },
  },
};
