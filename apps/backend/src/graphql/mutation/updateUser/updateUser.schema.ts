const updateUserTypeDef = `#graphql
type Mutation {
  updateUser(input: UpdateUserInput!): User!
}

input UpdateUserInput {
  password: String!
  displayName: String!
}
`;

export default updateUserTypeDef;
