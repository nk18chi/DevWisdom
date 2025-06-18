const userTypeDef = `#graphql
type User {
  _id: ID!
  displayName: String
  email: String!
  emailVerified: Boolean!
  status: UserStatus!
  password: String! # don't expose password so this is always null, handling by GraphQL Shield
}

enum UserStatus {
  ACTIVE
  INACTIVE
}
`;

export default userTypeDef;
