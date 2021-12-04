import { Request, Response } from 'express';
import JSON5 from 'json5';
import { Method, RouterSchema } from '../types';

/**
 * Naïve but simple date regex.
 * Will also match incorrect dates such as 2021-19-39T29:69:99.123Z.
 */
const DATE_REGEX =
  /^[0-9]{4}-[01][0-9]-[0-3][0-9]T[0-2][0-9]:[0-6][0-9]:[0-9]{2}\.[0-9]{3}Z$/;

const STATUS_BAD_REQUEST = 400;

/**
 * TODO: Use a Zod schema to identify specified dates in order to avoid accidental conversions.
 *
 * @return Indicates whether the headers have been sent.
 */
export const queryParser = (routerSchema: RouterSchema) => {
  const requestHandler = (req: Request, res: Response) => {
    const searchIndex = req.originalUrl.indexOf('?');
    const search =
      searchIndex === -1 ? '' : req.originalUrl.slice(searchIndex + 1);

    if (search) {
      req.query = JSON5.parse(decodeURIComponent(search), (key, value) => {
        return DATE_REGEX.test(value) ? new Date(value) : value;
      });

      const method = req.method.toLowerCase() as Method;
      const querySchema = routerSchema[req.route.path]?.[method]?.query;

      if (querySchema) {
        const result = querySchema.safeParse(req.query);
        if (!result.success) {
          res.status(STATUS_BAD_REQUEST);
          res.json({
            code: 'invalid_query',
            errors: result.error.errors,
          });
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
