import { Router } from '..';
import { userApi } from './user-api';

const userRouter = new Router<typeof userApi>();

userRouter.post('/', (req, res) => {});
