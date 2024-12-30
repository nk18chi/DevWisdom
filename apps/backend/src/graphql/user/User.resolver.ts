import { ok, okAsync } from 'neverthrow';
import User from '../../repositories/user/User.schema';
import { GqlResolvers } from '../types';
import { getUserByEmail, getUserById, saveCreatedUser, updateUser } from '../../repositories/user/User.repository';
import updateUserWorkflow from '../../workflows/updateUser.workflows';
import signInWorkflow from '../../workflows/signIn.workflows';
import { MongoId } from '../../objects/MongoId.object';
import signUpWorkflow from '../../workflows/signUp.workflows';
import getAuthorizedUser from '../../services/User.service';
import { Email } from '../../objects/Email.object';

const userResolver: GqlResolvers = {
  Query: {
    users: async (_, { first, after }) => {
      const query = after ? { _id: { $gt: after } } : {};
      const users = await User.find(query)
        .sort({ _id: 1 })
        .limit(first + 1)
        .lean();
      const hasNextPage = users.length > first;
      const edges = hasNextPage ? users.slice(0, -1) : users;
      return {
        edges: edges.map((user) => ({
          cursor: user._id.toString(),
          node: user,
        })),
        pageInfo: {
          endCursor: edges[edges.length - 1]?._id.toString(),
          hasNextPage,
        },
      };
    },
  },

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

export default userResolver;
