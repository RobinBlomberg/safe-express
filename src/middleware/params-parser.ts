import { Request, Response } from 'express';
import { Method, RouterSchema } from '../types';

const STATUS_BAD_REQUEST = 400;

/**
 * @return Indicates whether the headers have been sent.
 */
export const paramsParser = (routerSchema: RouterSchema) => {
  const requestHandler = (req: Request, res: Response) => {
    const method = req.method.toLowerCase() as Method;
    const paramsSchema = routerSchema[req.route.path]?.[method]?.params;

    if (paramsSchema) {
      const result = paramsSchema.safeParse(req.params);
      if (!result.success) {
        res.status(STATUS_BAD_REQUEST);
        res.json({
          code: 'invalid_params',
          errors: result.error.errors,
        });
        return true;
      }

      req.params = result.data;
    }

    return false;
  };
  return requestHandler;
};
