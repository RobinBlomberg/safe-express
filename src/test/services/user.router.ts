import { status } from '@robinblomberg/http-status';
import { RequestError } from '../../request-error';
import { userApi } from '../apis/user.api';
import { ErrorCode } from '../enums';
import { authChecker } from '../middleware/auth-checker';
import { bodyLogger } from '../middleware/body-logger';
import { TestRouter } from '../objects/test-router';
import { db } from './user.db';

const router = new TestRouter(userApi);

router.get('/', () => {
  return db.dispatch('GET_USERS');
});

router.post('/', (req) => {
  return db.dispatch('CREATE_USER', {
    user: req.body,
  });
});

router.get('/me', [bodyLogger(), authChecker()], (req) => {
  return req.data.user;
});

router.get('/:id', (req) => {
  const user = db.dispatch('GET_USER', {
    id: req.params.id,
  });

  if (!user) {
    throw new RequestError({
      code: ErrorCode.USER_NOT_FOUND,
      status: status.clientError.NOT_FOUND,
    });
  }

  return user;
});

export { router as userRouter };
