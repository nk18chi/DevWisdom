const GET_QUERY_QUOTES = `
  query Quotes($first: Int!, $after: String) {
    quotes(first: $first, after: $after) {
      edges {
        cursor
        node {
          _id
          content
          author
          status
          isReviewed
          createdAt
          updatedAt
          reports {
            _id
            comment
          }
          user {
            _id
            email
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export { GET_QUERY_QUOTES };
