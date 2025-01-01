const signInTypeDef = `#graphql
type Query {
  signIn(input: SignInUserInput!): String! @cacheControl(maxAge: 0) @rateLimit(limit: 5, duration: 300)
}

input SignInUserInput {
  email: String!
  password: String!
}
`;

export default signInTypeDef;
