import { SafeRouterOptions } from '../..';
import { cookieParser, userParser } from '../middleware';
import { TestRequestData } from '../objects/test-router';

export const routerOptions: SafeRouterOptions<TestRequestData> = {
  middleware: [cookieParser(), userParser()],
};
