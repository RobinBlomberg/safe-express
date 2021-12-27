import { ESON } from '@robinblomberg/eson';
import { Router } from '..';
import { UserApi, userApi } from './user-api';
import { User } from './user-schemas';
import { withAuth } from './with-auth';

type Props = {
  user: User;
};

const users: User[] = [];
let userId = 0;

const userRouter = new Router<UserApi, Props>(userApi);

userRouter.use((req, res, next) => {
  try {
    req.user = ESON.parse(req.cookies.user);
  } catch {}

  next();
});

userRouter.get('/', (req, res) => {
  const filteredUsers = users.filter((user) => {
    return (
      !req.query ||
      Boolean(req.query.ids?.includes(user.id)) ||
      Boolean(req.query.names?.includes(user.name))
    );
  });

  res.eson(filteredUsers);
});

userRouter.get('/date', (req, res) => {
  res.eson(req.query);
});

userRouter.get('/me', [withAuth()], (req, res) => {
  res.eson(req.user);
});

userRouter.get('/me2', withAuth(), (req, res) => {
  res.eson(req.user);
});

userRouter.get('/:id', (req, res) => {
  const foundUser = users.find((user) => user.id === req.params.id);

  if (!foundUser) {
    return res.status(404).eson('User not found');
  }

  return res.eson(foundUser);
});

userRouter.get('/:id/:id2', (req, res) => {
  res.eson(req.params);
});

userRouter.post('/', (req, res) => {
  const user = {
    ...req.body,
    id: userId++,
  };

  users.push(user);

  res.eson(user);
});

export { userRouter };
