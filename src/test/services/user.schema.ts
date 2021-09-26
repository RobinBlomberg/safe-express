import { z as $ } from 'zod';

export type User = $.infer<typeof $user>;
export const $user = $.object({
  email: $.string().email(),
  id: $.number().int(),
  name: $.string().nonempty(),
}).strict();

export type NewUser = $.infer<typeof $newUser>;
export const $newUser = $.object({
  email: $.string().email(),
  name: $.string().nonempty(),
});
