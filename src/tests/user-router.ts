import { Router } from '..';
import { userApi } from './user-api';
import { User } from './user-schemas';

const users: User[] = [];
let userId = 0;

const userRouter = new Router(userApi);

userRouter.get('/', (req, res) => {
  const filteredUsers = users.filter(
    (user) => !req.query.name || user.name === req.query.name,
  );

  res.json(filteredUsers);
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
