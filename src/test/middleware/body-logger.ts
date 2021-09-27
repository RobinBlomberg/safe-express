import { Middleware } from '../..';

export const bodyLogger = (): Middleware => {
  return (req) => {
    // eslint-disable-next-line no-console
    console.log(req.data.user);
  };
};
