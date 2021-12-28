import express from 'express';
import { userRouter } from './user-router';

const PORT = 3003;

const app = express();

app.use('/api/v1/user', userRouter.router);

app.listen(PORT, () => {
  console.info(`The server is running on port ${PORT}.`);
});
