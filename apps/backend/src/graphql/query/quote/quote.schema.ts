const quoteTypeDef = `#graphql
type QuoteReport {
  _id: ID!
  comment: String!
  userId: ID!
  status: QuoteReportStatus!
  createdAt: String!
  updatedAt: String!
}

type Quote {
  _id: ID!
  content: String!
  author: String!
  status: QuoteStatus!
  reports: [QuoteReport!]!
  isReviewed: Boolean!
  createdAt: Date!
  updatedAt: Date!
  user: User!
  likeCount: Int!
  likedUsers(number: Int): [User!]!
}

enum QuoteStatus {
  Published
  Unpublished
}

enum QuoteReportStatus {
  Unreviewed
  Declined
  Resolved
}

type Query {
  quote(id: ID!): Quote
}
`;

export default quoteTypeDef;
