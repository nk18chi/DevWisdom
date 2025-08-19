const GET_QUERY_RANDOM_QUOTE = `
  query RandomQuote {
    randomQuote {
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
        avatar
        displayName
      }
    }
  }
`;

export { GET_QUERY_RANDOM_QUOTE };
