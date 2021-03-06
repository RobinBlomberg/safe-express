import { RequestHandler } from '../types';

const STATUS_CODE_UNAUTHORIZED = 401;

export const withAuth = () => {
  const requestHandler: RequestHandler<{ user: { id: unknown } }> = (
    req,
    res,
    next,
  ) => {
    if (!req.user || req.user.id == null) {
      res
        .status(STATUS_CODE_UNAUTHORIZED)
        .eson({ code: 'UserNotAuthorized', errors: [] });
      return;
    }

    next();
  };
  return requestHandler;
};
