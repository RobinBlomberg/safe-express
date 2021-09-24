import $ from 'zod';
import { App } from '.';

const app = new App({
  '/user': {
    '/:id': {
      requestBody: $.object({ name: $.string() }),
      responseBody: $.string(),
    },
  },
});

const userRouter = app.createRouter('/user');

userRouter.get('/:id', (req, res) => {
  return 'Hello world!';
});
