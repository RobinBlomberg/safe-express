import { ESON } from '@robinblomberg/eson';
import { RequestParser } from '../types';
import { sendEson } from '../utils/send-eson';

export const eson = () => {
  const requestParser: RequestParser = (req, res) => {
    if (req.headers['content-type'] === 'application/javascript') {
      req.body = ESON.parse(req.body);
    }

    res.eson = (body?: any) => {
      sendEson(res, body);
    };

    return false;
  };
  return requestParser;
};
