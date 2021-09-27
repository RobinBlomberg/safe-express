import { Locals, Params, Query, RequestHandler } from '../..';

export const userParser = (): RequestHandler<
  Params,
  unknown,
  unknown,
  Query,
  Locals,
  { user: { name: string } }
> => {
  return (req, res, next) => {
    const authToken = req.cookies['sally.authToken'];
    if (authToken) {
      req.data.user = { name: 'Hello world!' };
    }

    next();
  };
};
