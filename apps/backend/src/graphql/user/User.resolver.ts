import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { ok } from 'neverthrow';
import User from '../../repositories/user/User.schema';
import { GqlResolvers } from '../types';
import { getUserById, saveCreatedUser, updateUser } from '../../repositories/user/User.repository';
import updateUserWorkflow from '../../workflows/updateUser.workflows';
import { MongoId } from '../../objects/MongoId.object';
import createUserWorkflow from '../../workflows/createUser.workflows';
import getAuthorizedUser from '../../services/User.service';

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

    userToken: async () => {
      const privateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n');
      return jwt.sign({ _id: new Types.ObjectId('676de19c6bb885d2b8d55b53') }, privateKey);
    },
  },

  Mutation: {
    createUser: (_, { input }) => {
      const workflow = createUserWorkflow;

      const invalidatedUser = {
        email: input.email,
        password: input.password,
      };

      const result = ok(invalidatedUser).andThen(workflow).asyncAndThen(saveCreatedUser);

      return result.match(
        (user) => user,
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

      const result = preprocess.andThen(workflow).asyncAndThen(updateUser);

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
