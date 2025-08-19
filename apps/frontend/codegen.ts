import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['**/*.tsx'],
  ignoreNoDocuments: true,
  generates: {
    './gql/types/': {
      preset: 'client',
    },
    './gql/generated/types.ts': {
      documents: ['./gql/queries/*.graphql'],
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
      },
    },
  },
};

export default config;
