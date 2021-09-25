import chalk from 'chalk';
import { Dispatcher, logger } from '../utils';
import { NewUser, User } from './user.schema';

let userId = 0;

const users: {
  [KId in string]?: User;
} = {};

const actions = {
  CREATE_USER: ({ user: newUser }: { user: NewUser }) => {
    const user = {
      ...newUser,
      id: userId++,
    };

    users[user.id] = user;

    return user;
  },
  GET_USER: ({ id }: { id: string }) => {
    return users[id];
  },
  GET_USERS: () => {
    return Object.values(users) as User[];
  },
};

export const db = new Dispatcher({
  actions,
  before: (action, ...payload) => {
    logger.db(chalk.green(action), ...payload);
  },
});
