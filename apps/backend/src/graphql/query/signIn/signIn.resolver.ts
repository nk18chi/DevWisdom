import { ok } from 'neverthrow';
import { ValidationError } from 'zod-validation-error';
import { GqlResolvers } from '../../types';
import { getUserByEmail } from '../../../repositories/user/User.repository';
import signInWorkflow from '../../../workflows/signIn.workflows';
import { Email } from '../../../objects/Email.object';

const userResolver: GqlResolvers = {
  Query: {
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
            if (error instanceof ValidationError) {
              throw error;
            }
            // hide whether or not the user exists in the system
            throw new Error('Email or Password is incorrect');
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
