import chalk from 'chalk';
import { inspect } from 'util';
import { ModuleLogger } from './create-logger.types';

export const createLogger = <TModuleName extends string>(
  moduleNames: TModuleName | TModuleName[],
) => {
  if (typeof moduleNames === 'string') {
    moduleNames = [moduleNames];
  }

  const moduleLoggers = {} as Record<TModuleName, ModuleLogger>;

  const maxNameLength = moduleNames.reduce((length, moduleName) => {
    return moduleName.length > length ? moduleName.length : length;
  }, 0);

  for (const moduleName of moduleNames) {
    const prefix = moduleName
      ? chalk.gray(`${moduleName.padEnd(maxNameLength)} |`)
      : undefined;

    const stringify = (...args: unknown[]) => {
      return [...(prefix ? [prefix] : []), ...args]
        .map((string) => {
          return typeof string === 'string'
            ? string
            : inspect(string, { colors: true });
        })
        .join(' ');
    };

    moduleLoggers[moduleName] = Object.assign(
      (...args: unknown[]) => {
        console.debug(stringify(...args));
      },
      { stringify },
    );
  }

  return moduleLoggers;
};
