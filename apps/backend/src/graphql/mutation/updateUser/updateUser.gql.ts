const MUTATION_UPDATE_USER = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      _id
      email
    }
  }
`;

export default MUTATION_UPDATE_USER;
