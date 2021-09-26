import chalk, { Chalk } from 'chalk';
import morgan from 'morgan';
import { MethodUpperCase, TransformFunction } from '..';

const MethodColorMap: Record<MethodUpperCase, Chalk> = {
  DELETE: chalk.red,
  GET: chalk.blue,
  HEAD: chalk.magenta,
  OPTIONS: chalk.white,
  PATCH: chalk.cyan,
  POST: chalk.green,
  PUT: chalk.yellow,
};

const StatusColorMap: Record<string, Chalk> = {
  1: chalk.blue,
  2: chalk.green,
  3: chalk.cyan,
  4: chalk.yellow,
  5: chalk.red,
};

const createFormatter = (transform?: TransformFunction) => {
  const formatter: morgan.FormatFn = (tokens, req, res) => {
    const colorizeMethod =
      MethodColorMap[req.method as MethodUpperCase] ?? chalk.white;
    const colorizeStatus =
      StatusColorMap[String(res.statusCode)[0]!] ?? chalk.white;

    const method = colorizeMethod(tokens.method?.(req, res) ?? '?');
    const url = tokens.url?.(req, res);
    const status = colorizeStatus(tokens.status?.(req, res) ?? '?');
    const ms = parseInt(tokens['response-time']?.(req, res) ?? '', 10);

    const string = `${method} ${url} ${status} ${ms}ms`;

    return transform ? transform(string) : string;
  };
  return formatter;
};

export const logger = (transform?: TransformFunction) => {
  return morgan(createFormatter(transform));
};
