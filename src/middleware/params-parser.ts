import { z } from 'zod';
import { Method, RequestParser, RouterSchema } from '../types';
import { sendEson } from '../utils/send-eson';

const STATUS_BAD_REQUEST = 400;

/**
 * @return Indicates whether the headers have been sent.
 */
export const paramsParser = (routerSchema: RouterSchema) => {
  const requestHandler: RequestParser = (req, res) => {
    const method = req.method.toLowerCase() as Method;
    const paramsDefinition = routerSchema[req.route.path]?.[method]?.params;

    if (paramsDefinition) {
      const shape: Record<string, z.ZodTypeAny> = {};

      for (const param in paramsDefinition) {
        if (paramsDefinition[param]) {
          shape[param] =
            paramsDefinition[param]!._def.typeName === 'ZodNumber'
              ? z.string().transform(Number)
              : z.string();
        }
      }

      const paramsSchema = z.strictObject(shape);
      const result = paramsSchema.safeParse(req.params);

      if (!result.success) {
        res.status(STATUS_BAD_REQUEST);
        sendEson(res, {
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
