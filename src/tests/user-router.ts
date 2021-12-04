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
    req.user = JSON.parse(req.cookies.user);
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

  res.json(filteredUsers);
});

userRouter.get('/date', (req, res) => {
  res.json(req.query);
});

userRouter.get('/me', [withAuth()], (req, res) => {
  res.json(req.user);
});

userRouter.get('/:id', (req, res) => {
  const foundUser = users.find((user) => user.id === req.params.id);

  if (!foundUser) {
    return res.status(404).json('User not found');
  }

  return res.json(foundUser);
});

userRouter.post('/', (req, res) => {
  const user = {
    ...req.body,
    id: userId++,
  };

  users.push(user);

  res.json(user);
});

export { userRouter };
