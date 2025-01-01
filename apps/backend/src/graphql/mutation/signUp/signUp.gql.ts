const MUTATION_SIGN_UP = `
  mutation SignUp($input: SignUpUserInput!) {
    signUp(input: $input) {
      _id
      email
    }
  }
`;

export default MUTATION_SIGN_UP;
