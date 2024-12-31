const usersTypeDef = `#graphql
type User {
  _id: ID!
  email: String!
  emailVerified: Boolean!
  status: UserStatus!
  password: String! # don't expose password so this is always null, handling by GraphQL Shield
}

type UserConnection @cacheControl(maxAge: 60) {
  edges: [UserEdge]
  pageInfo: PageInfo
}

type UserEdge {
  node: User
  cursor: String
}

type PageInfo {
  endCursor: String
  hasNextPage: Boolean
}

type Query {
  users(first: Int!, after: String): UserConnection
}
`;

export default usersTypeDef;
