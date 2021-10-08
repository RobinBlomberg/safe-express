import { z } from 'zod';

export const userApi = {
  '/': {
    post: {
      requestBody: z.object({
        name: z.string(),
      }),
    },
  },
};
