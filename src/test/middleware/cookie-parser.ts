import { Middleware } from '../..';

export const cookieParser = (): Middleware => {
  return (req) => {
    req.data.cookies = {};

    if (req.headers.cookie) {
      const cookies = req.data.cookies as Record<string, string>;
      const pairs = (req.headers.cookie ?? '').split('; ');

      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
          cookies[key] = value ?? '';
        }
      }
    }
  };
};
