const QUERY_SIGN_IN = `
  query SignIn($input: SignInUserInput!) {
    signIn(input: $input)
  }
`;

export default QUERY_SIGN_IN;
