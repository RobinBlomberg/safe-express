import { status } from '../..';
import { RequestError } from '../../request-error';
import { safe } from '../../safe';
import { testApi } from '../apis';
import { ErrorCode } from '../enums';
import { db } from './user.db';

const router = safe.createRouter(testApi, '/api/v1/user');

router.get('', () => {
  return db.dispatch('GET_USERS');
});

router.post('', ({ request }) => {
  return db.dispatch('CREATE_USER', {
    user: request.body,
  });
});

router.get('/:id', ({ request }) => {
  const user = db.dispatch('GET_USER', {
    id: request.params.id,
  });

  if (!user) {
    throw new RequestError({
      code: ErrorCode.USER_NOT_FOUND,
      status: status.NOT_FOUND,
    });
  }

  return user;
});

export { router as userRouter };
