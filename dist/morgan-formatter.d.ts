import morgan from 'morgan';
export declare type TransformFunction = (string: string) => string;
export declare const logger: (transform: TransformFunction) => morgan.FormatFn<import("http").IncomingMessage, import("http").ServerResponse>;
