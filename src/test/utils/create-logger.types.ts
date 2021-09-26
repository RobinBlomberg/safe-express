export type ModuleLogger = ((...args: unknown[]) => void) & {
  stringify: (...args: unknown[]) => string;
};
