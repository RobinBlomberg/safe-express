export type Actions = {
  [K in string]: (payload?: any) => any;
};

export type AfterDispatchFunction<TActions extends Actions> = (
  this: {
    error: unknown;
    result: unknown;
  },
  action: keyof TActions,
  ...payloads: unknown[]
) => void;

export type BeforeDispatchFunction<TActions extends Actions> = (
  action: keyof TActions,
  ...payloads: unknown[]
) => void;

export type DispatcherOptions<TActions extends Actions> = {
  actions: TActions;
  after?: AfterDispatchFunction<TActions>;
  before?: BeforeDispatchFunction<TActions>;
};

export type Listeners<TActions extends Actions> = {
  [K in keyof TActions]: {
    after: AfterDispatchFunction<TActions>[];
    before: BeforeDispatchFunction<TActions>[];
  };
};
