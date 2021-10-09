import { Router } from '..';
import { UserApi, userApi } from './user-api';
import { User } from './user-schemas';

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
  const filteredUsers = users.filter(
    (user) => !req.query.name || user.name === req.query.name,
  );

  res.json(filteredUsers);
});

userRouter.get('/me', (req, res) => {
  res.json(req.user);
});

userRouter.get('/:id', (req, res) => {
  const foundUser = users.find((user) => user.id === req.params.id) ?? null;

  res.json(foundUser);
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
