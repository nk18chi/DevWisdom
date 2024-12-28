const GET_QUERY_USERS = `
  query Users($first: Int!, $after: String) {
    users(first: $first, after: $after) {
      edges {
        cursor
        node {
          _id
          email
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

// eslint-disable-next-line import/prefer-default-export
export { GET_QUERY_USERS };
