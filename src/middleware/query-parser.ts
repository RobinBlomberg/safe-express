import { ESON } from '@robinblomberg/eson';
import { Request, Response } from 'express';
import { Method, RouterSchema } from '../types';

const STATUS_BAD_REQUEST = 400;

/**
 * @return Indicates whether the headers have been sent.
 */
export const queryParser = (routerSchema: RouterSchema) => {
  const requestHandler = (req: Request, res: Response) => {
    const searchIndex = req.originalUrl.indexOf('?');
    const search =
      searchIndex === -1 ? '' : req.originalUrl.slice(searchIndex + 1);

    if (search) {
      req.query = ESON.parse(decodeURIComponent(search));

      const method = req.method.toLowerCase() as Method;
      const querySchema = routerSchema[req.route.path]?.[method]?.query;

      if (querySchema) {
        const result = querySchema.safeParse(req.query);
        if (!result.success) {
          res
            .status(STATUS_BAD_REQUEST)
            .type('js')
            .end(
              ESON.stringify({
                code: 'invalid_query',
                errors: result.error.errors,
              }),
            );
          return true;
        }
      }
    } else {
      req.query = undefined as any;
    }

    return false;
  };
  return requestHandler;
};
