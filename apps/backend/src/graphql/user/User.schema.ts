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
  userToken: String @cacheControl(maxAge: 0) @rateLimit(limit: 3, duration: 5)
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(input: UpdateUserInput!): User!
}

input CreateUserInput {
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
