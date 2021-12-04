import { Request, Response } from 'express';
import { Method, RouterSchema } from '../types';

const STATUS_BAD_REQUEST = 400;

/**
 * @return Indicates whether the headers have been sent.
 */
export const requestBodyParser = (routerSchema: RouterSchema) => {
  const requestHandler = (req: Request, res: Response) => {
    const method = req.method.toLowerCase() as Method;
    const querySchema = routerSchema[req.route.path]?.[method]?.requestBody;

    if (querySchema) {
      const result = querySchema.safeParse(req.body);
      if (!result.success) {
        res.status(STATUS_BAD_REQUEST);
        res.json({
          code: 'invalid_request_body',
          errors: result.error.errors,
        });
        return true;
      }
    }

    return false;
  };
  return requestHandler;
};
