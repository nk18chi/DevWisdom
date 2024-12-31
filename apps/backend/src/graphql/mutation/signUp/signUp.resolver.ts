import { okAsync } from 'neverthrow';
import { GqlResolvers } from '../../types';
import { saveCreatedUser } from '../../../repositories/user/User.repository';
import signUpWorkflow from '../../../workflows/signUp.workflows';

const signUpResolver: GqlResolvers = {
  Mutation: {
    signUp: (_, { input }) => {
      const workflow = signUpWorkflow;
      const invalidatedUser = {
        email: input.email,
        password: input.password,
      };
      const result = okAsync(invalidatedUser).andThen(workflow).andThen(saveCreatedUser);
      return result.match(
        (user) => user,
        (error) => {
          throw error;
        },
      );
    },
  },
};

export default signUpResolver;
