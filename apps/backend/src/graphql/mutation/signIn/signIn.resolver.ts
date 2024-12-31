import { ok } from 'neverthrow';
import { GqlResolvers } from '../../types';
import { getUserByEmail } from '../../../repositories/user/User.repository';
import signInWorkflow from '../../../workflows/signIn.workflows';
import { Email } from '../../../objects/Email.object';

const userResolver: GqlResolvers = {
  Mutation: {
    signIn: async (_, { input }) => {
      const workflow = signInWorkflow;
      const preprocess = await Email(input.email)
        .asyncAndThen(getUserByEmail)
        .match(
          (user) => {
            const invalidatedUserCommand = {
              input: {
                email: input.email,
                password: input.password,
              },
              user,
            };
            return ok(invalidatedUserCommand);
          },
          (error) => {
            throw error;
          },
        );
      const result = preprocess.asyncAndThen(workflow);
      return result.match(
        (token) => token.toString(),
        (error) => {
          throw error;
        },
      );
    },
  },
};

export default userResolver;
