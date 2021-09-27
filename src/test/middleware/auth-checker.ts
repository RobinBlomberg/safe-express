import { status } from '@robinblomberg/http-status';
import { Middleware, RequestError } from '../..';

export const authChecker = (): Middleware => {
  return (req) => {
    if (
      !(req.data.user instanceof Object) ||
      (req.data.user as any).role !== 'ADMIN'
    ) {
      throw new RequestError({
        code: 'USER_NOT_AUTHORIZED',
        status: status.clientError.UNAUTHORIZED,
      });
    }
  };
};
