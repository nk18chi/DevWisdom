import { ok } from 'neverthrow';
import { GqlResolvers } from '../../types';
import { getUserById, updateUser } from '../../../repositories/user/User.repository';
import updateUserWorkflow from '../../../workflows/updateUser.workflows';
import { MongoId } from '../../../objects/MongoId.object';
import getAuthorizedUser from '../../../services/User.service';

const updateUserResolver: GqlResolvers = {
  Mutation: {
    updateUser: async (_, { input }, context) => {
      const workflow = updateUserWorkflow;
      const preprocess = await getAuthorizedUser(context)
        .andThen((user) => MongoId(user._id.toString()))
        .asyncAndThen(getUserById)
        .match(
          (user) => {
            const invalidatedUserCommand = {
              input: {
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
      const result = preprocess.asyncAndThen(workflow).andThen(updateUser);
      return result.match(
        (user) => user,
        (error) => {
          throw error;
        },
      );
    },
  },
};

export default updateUserResolver;
