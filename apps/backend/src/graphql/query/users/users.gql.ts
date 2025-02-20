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

export { GET_QUERY_USERS };
