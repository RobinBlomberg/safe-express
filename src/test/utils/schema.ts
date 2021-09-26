import { z } from 'zod';

export type { infer as $infer } from 'zod';

export const $and = z.intersection;

export const $array = z.array;

export const $bigint = z.bigint();

export const $boolean = z.boolean();

export const $cuid = z.string().cuid();

export const $date = z.date();

export const $email = z.string().email();

export const $enum = z.enum;

export const $function = z.function();

export const $instanceof = z.instanceof;

export const $int = z.number().int();

export const $map = z.map;

export const $nestring = z.string().nonempty();

export const $null = z.null();

export const $regex = (regex: RegExp) => {
  return z.string().regex(regex);
};

export const $port = $regex(/[1-9][0-9]{1,4}/);

export const $promise = z.promise;

export const $object = <T extends z.ZodRawShape>(schema: T) => {
  return z.object(schema).strict();
};

export const $or = z.union;

export const $record = z.record;

export const $set = z.set;

export const $string = z.string();

export const $tuple = z.tuple;

export const $uint = z.number().int().nonnegative();

export const $undefined = z.undefined();

export const $unknown = z.unknown();

export const $uuid = z.string().uuid();

export const $url = z.string().url();
