import { ESON } from '@robinblomberg/eson';
import { Request } from 'express';

export const esonParser = () => {
  const requestHandler = (req: Request) => {
    if (req.headers['content-type'] === 'application/javascript') {
      req.body = ESON.parse(req.body);
    }

    return false;
  };
  return requestHandler;
};
