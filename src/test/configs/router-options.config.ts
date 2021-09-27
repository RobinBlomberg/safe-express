import { cookieParser, userParser } from '../middleware';

export const routerOptions = {
  middleware: [cookieParser(), userParser()],
};
