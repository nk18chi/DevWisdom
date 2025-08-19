const updateUserTypeDef = `#graphql
type Mutation {
  updateUser(input: UpdateUserInput!): User!
}

input UpdateUserInput {
  password: String!
  displayName: String!
  avatar: String
}
`;

export default updateUserTypeDef;
