import { ESON } from '@robinblomberg/eson';
import { Response } from 'express';

export const sendEson = (res: Response, body?: any) => {
  return res.type('js').send(ESON.stringify(body, null, 2));
};
