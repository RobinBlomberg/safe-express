import { RequestErrorOptions } from '.';

export class RequestError<TCode extends string> extends Error {
  readonly code: TCode;
  readonly status: number;

  constructor(options: RequestErrorOptions<TCode>) {
    super(options.code);

    this.code = options.code;
    this.name = RequestError.name;
    this.status = options.status;
  }
}
