const GQL_QUERY_GET_USERS = `
  query Users {
    getUsers {
      _id
      email
    }
  }
`;

const GQL_QUERY_USER_TOKEN = `
  query UserToken {
    userToken
  }
`;

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

export { GET_QUERY_USERS, GQL_QUERY_GET_USERS, GQL_QUERY_USER_TOKEN };
