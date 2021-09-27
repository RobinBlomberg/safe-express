import { Locals, Params, Query, RequestHandler } from '../..';

export const cookieParser = (): RequestHandler<
  Params,
  unknown,
  unknown,
  Query,
  Locals,
  { cookies: Record<string, string> }
> => {
  return (req, res, next) => {
    req.data.cookies = { 'user-id': 'foo123' };

    next();
  };
};
