import {
  Actions,
  AfterDispatchFunction,
  BeforeDispatchFunction,
  DispatcherOptions,
  Listeners,
} from './dispatcher.types';

export class Dispatcher<TActions extends Actions> {
  readonly #actions: TActions;
  readonly #afterAll: AfterDispatchFunction<TActions> | undefined;
  readonly #beforeAll: BeforeDispatchFunction<TActions> | undefined;
  readonly #listeners: Listeners<TActions>;

  constructor(options: DispatcherOptions<TActions>) {
    this.#actions = options.actions;
    this.#afterAll = options.after;
    this.#beforeAll = options.before;
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
    this.#afterAll?.call({ error, result }, action, ...payloads);

    for (const listener of this.#listeners[action].after) {
      listener.call({ error, result }, action, ...payloads);
    }
  }

  after(action: keyof TActions, listener: AfterDispatchFunction<TActions>) {
    this.#listeners[action].after.push(listener);
  }

  before(action: keyof TActions, listener: BeforeDispatchFunction<TActions>) {
    this.#listeners[action].before.push(listener);
  }

  dispatch<TAction extends keyof TActions & string>(
    action: TAction,
    ...payloads: Parameters<TActions[TAction]>
  ) {
    let result: ReturnType<TActions[TAction]>;

    this.#beforeAll?.(action, ...payloads);

    for (const listener of this.#listeners[action].before) {
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
