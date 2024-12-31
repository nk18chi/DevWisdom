const signUpTypeDef = `#graphql
type Mutation {
  signUp(input: SignUpUserInput!): User! @rateLimit(limit: 5, duration: 60)
}

input SignUpUserInput {
  email: String!
  password: String!
}
`;

export default signUpTypeDef;
