import { shield, allow } from 'graphql-shield';
import isAuthenticated from './rules/isAuthenticated.rule';

const permissions = shield(
  {
    Query: {
      '*': isAuthenticated,
    },
    Mutation: {
      '*': isAuthenticated,
      signUp: allow,
      signIn: allow,
    },
  },
  {
    allowExternalErrors: true,
  },
);

export default permissions;
