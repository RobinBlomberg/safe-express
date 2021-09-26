import { $email, $infer, $nestring, $object, $uint } from '@robinblomberg/zod';

export type User = $infer<typeof $user>;
export const $user = $object({
  email: $email,
  id: $uint,
  name: $nestring,
});

export type NewUser = $infer<typeof $newUser>;
export const $newUser = $object({
  email: $email,
  name: $nestring,
});
