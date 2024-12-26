import { shield, allow } from 'graphql-shield';
import isAuthenticated from './rules/isAuthenticated.rule';

const permissions = shield(
  {
    Query: {
      '*': isAuthenticated,
    },
    Mutation: {
      '*': isAuthenticated,
      createUser: allow,
    },
  },
  {
    allowExternalErrors: true,
  },
);

export default permissions;
