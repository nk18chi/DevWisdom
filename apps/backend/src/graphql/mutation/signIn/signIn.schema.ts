const signInTypeDef = `#graphql
type Mutation {
  signIn(input: SignInUserInput!): String! @cacheControl(maxAge: 0) @rateLimit(limit: 1, duration: 5)
}

input SignInUserInput {
  email: String!
  password: String!
}
`;

export default signInTypeDef;
