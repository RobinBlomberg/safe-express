import express from 'express';
import { userRouter } from './user-router';

const app = express();

app.use('/api/v1/user', userRouter.router);

app.listen(3000, () => {
  console.info('The server is running.');
});
