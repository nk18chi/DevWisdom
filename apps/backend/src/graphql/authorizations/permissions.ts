import { shield, allow, deny } from 'graphql-shield';
import isAuthenticated from './rules/isAuthenticated.rule';

const permissions = shield(
  {
    Query: {
      '*': isAuthenticated,
      signIn: allow,
      quote: allow,
      quotes: allow,
      randomQuote: allow,
    },
    Mutation: {
      '*': isAuthenticated,
      signUp: allow,
    },
    User: {
      password: deny,
    },
  },
  {
    allowExternalErrors: true,
  },
);

export default permissions;
