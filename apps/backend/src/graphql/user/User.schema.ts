const userTypeDef = `#graphql
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
  getUsers: [User]
}

type Mutation {
  signUp(input: SignUpUserInput!): User! @rateLimit(limit: 5, duration: 60)
  signIn(input: SignInUserInput!): String! @cacheControl(maxAge: 0) @rateLimit(limit: 1, duration: 5)
  updateUser(input: UpdateUserInput!): User!
}

input SignUpUserInput {
  email: String!
  password: String!
}

input SignInUserInput {
  email: String!
  password: String!
}

input UpdateUserInput {
  password: String!
}

enum UserStatus {
  ACTIVE
  INACTIVE
}

`;

export default userTypeDef;
