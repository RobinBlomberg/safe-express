/// <reference types="node" />
import { TransformFunction } from '..';
export declare const logger: (transform?: TransformFunction | undefined) => (req: import("http").IncomingMessage, res: import("http").ServerResponse, callback: (err?: Error | undefined) => void) => void;
