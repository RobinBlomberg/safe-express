import { Middleware } from '../..';

export const userParser = (): Middleware => {
  return (req) => {
    const user = (req.data.cookies as any).user;
    if (req.data.cookies instanceof Object && typeof user === 'string') {
      try {
        req.data.user = JSON.parse(user);
      } catch {}
    }
  };
};
