import { RequestHandlerWithProps } from '../types';

const STATUS_CODE_UNAUTHORIZED = 401;

export const withAuth = () => {
  const requestHandler: RequestHandlerWithProps<
    {},
    any,
    any,
    {},
    { user?: { id: string | null } }
  > = (req, res, next) => {
    if (!req.user || req.user.id == null) {
      res
        .status(STATUS_CODE_UNAUTHORIZED)
        .json({ code: 'USER_NOT_AUTHORIZED' });
      return;
    }

    next();
  };
  return requestHandler;
};
