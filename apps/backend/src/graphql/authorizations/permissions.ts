import { shield, allow } from 'graphql-shield';
import isAuthenticated from './rules/isAuthenticated.rule';

const permissions = shield(
  {
    Query: {
      '*': isAuthenticated,
      signIn: allow,
    },
    Mutation: {
      '*': isAuthenticated,
      signUp: allow,
    },
  },
  {
    allowExternalErrors: true,
  },
);

export default permissions;
