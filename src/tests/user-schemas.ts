import { z } from 'zod';

export type NewUser = z.infer<typeof $newUser>;
export type User = z.infer<typeof $user>;

export const $newUser = z
  .object({
    email: z.string().email(),
    name: z.string(),
  })
  .strict();

export const $user = z
  .object({
    email: z.string().email(),
    id: z.number().int().nonnegative(),
    name: z.string(),
  })
  .strict();
