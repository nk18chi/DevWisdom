const GET_QUERY_QUOTE = `
  query Quote($id: ID!) {
    quote(id: $id) {
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
`;

export { GET_QUERY_QUOTE };
