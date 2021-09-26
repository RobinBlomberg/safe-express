import { SafeRouter, status } from '../..';
import { RequestError } from '../../request-error';
import { userApi } from '../apis';
import { ErrorCode } from '../enums';
import { db } from './user.db';

const router = new SafeRouter(userApi);

router.get('/', () => {
  return db.dispatch('GET_USERS');
});

router.post('/', (req) => {
  return db.dispatch('CREATE_USER', {
    user: req.body,
  });
});

router.get('/:id', (req) => {
  const user = db.dispatch('GET_USER', {
    id: req.params.id,
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
