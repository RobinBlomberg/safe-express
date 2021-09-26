import {
  Actions,
  AfterDispatchFunction,
  BeforeDispatchFunction,
  DispatcherOptions,
  Listeners,
} from './dispatcher.types';

export class Dispatcher<TActions extends Actions> {
  readonly #actions: TActions;
  readonly #afterAll: AfterDispatchFunction<TActions>[];
  readonly #beforeAll: BeforeDispatchFunction<TActions>[];
  readonly #listeners: Listeners<TActions>;

  constructor(options: DispatcherOptions<TActions>) {
    this.#actions = options.actions;
    this.#afterAll = options.after ? [options.after] : [];
    this.#beforeAll = options.before ? [options.before] : [];
    this.#listeners = {} as Listeners<TActions>;

    for (const action of Object.keys(this.#actions)) {
      this.#listeners[action as keyof TActions] = {
        after: [] as AfterDispatchFunction<TActions>[],
        before: [] as BeforeDispatchFunction<TActions>[],
      };
    }
  }

  #emitAfter(
    error: unknown,
    result: unknown,
    action: keyof TActions & string,
    payloads: unknown[],
  ) {
    const listeners = [...this.#afterAll, ...this.#listeners[action].after];

    for (const listener of listeners) {
      listener.call({ error, result }, action, ...payloads);
    }
  }

  after(listener: AfterDispatchFunction<TActions>): void;
  after(
    action: keyof TActions,
    listener: AfterDispatchFunction<TActions>,
  ): void;
  after(
    ...args:
      | [AfterDispatchFunction<TActions>]
      | [keyof TActions, AfterDispatchFunction<TActions>]
  ) {
    if (typeof args[0] === 'function') {
      this.#afterAll.push(args[0]);
    } else {
      this.#listeners[args[0]].after.push(args[1]!);
    }
  }

  before(listener: BeforeDispatchFunction<TActions>): void;
  before(
    action: keyof TActions,
    listener: BeforeDispatchFunction<TActions>,
  ): void;
  before(
    ...args:
      | [BeforeDispatchFunction<TActions>]
      | [keyof TActions, BeforeDispatchFunction<TActions>]
  ) {
    if (typeof args[0] === 'function') {
      this.#beforeAll.push(args[0]);
    } else {
      this.#listeners[args[0]].before.push(args[1]!);
    }
  }

  dispatch<TAction extends keyof TActions & string>(
    action: TAction,
    ...payloads: Parameters<TActions[TAction]>
  ) {
    const listeners = [...this.#beforeAll, ...this.#listeners[action].before];
    let result: ReturnType<TActions[TAction]>;

    for (const listener of listeners) {
      listener(action, ...payloads);
    }

    try {
      result = this.#actions[action]!(...payloads);

      this.#emitAfter(undefined, result, action, payloads);
    } catch (error: unknown) {
      this.#emitAfter(error, undefined, action, payloads);

      throw error;
    }

    return result;
  }
}
