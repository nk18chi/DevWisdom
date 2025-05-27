import { test, describe, vi, expect, beforeEach, assert } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { rateLimitDirective } from 'graphql-rate-limit-directive';
import { err, errAsync, ok, okAsync } from 'neverthrow';
import Context from '../../../types/interfaces/Context.interface';
import typeDefs from '../../schemas';
import resolvers from '../../resolvers';
import permissions from '../../authorizations/permissions';
import * as userRepository from '../../../infrastructure/repositories/user/User.repository';
import MUTATION_UPDATE_USER from './updateUser.gql';
import * as updateUserWorkflow from '../../../workflows/updateUser/updateUser.workflows';
import * as getAuthorizedUser from '../../../services/user/User.service';

const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } = rateLimitDirective();

describe('updateUser.resolver.ts', async () => {
  const mockUser: any = {
    _id: '666a86b3ee5b217b01281a39',
    email: 'john@example.com',
  };
  const contextMock: any = {
    contextValue: {
      user: {
        _id: mockUser._id,
      },
      dataLoaders: {},
    },
  };
  beforeEach(() => {
    vi.spyOn(userRepository, 'getUserById').mockImplementation(() => okAsync(mockUser));
    vi.spyOn(updateUserWorkflow, 'default').mockImplementation(() => okAsync(mockUser));
    vi.spyOn(userRepository, 'updateUser').mockResolvedValue(okAsync(mockUser) as any);
    vi.spyOn(getAuthorizedUser, 'default').mockReturnValue(ok(mockUser));
  });

  const schema = applyMiddleware(
    makeExecutableSchema({
      typeDefs: [...(await typeDefs()), rateLimitDirectiveTypeDefs],
      resolvers: await resolvers(),
    }),
    permissions,
  );
  const testServer = new ApolloServer<Context>({
    schema: rateLimitDirectiveTransformer(schema),
  });
  describe('updateUser mutation', () => {
    const input = {
      password: 'OIY*(YPJP(*$R#rqavr3241',
    };
    test('should return user when the workflow is successful', async () => {
      const response = await testServer.executeOperation(
        {
          query: MUTATION_UPDATE_USER,
          variables: { input },
        },
        contextMock,
      );
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data).toEqual({
        updateUser: mockUser,
      });
      expect(getAuthorizedUser.default).toHaveBeenCalledWith(expect.objectContaining(contextMock.contextValue));
      expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser._id);
      expect(updateUserWorkflow.default).toHaveBeenCalledWith({ input, user: mockUser });
      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUser);
    });
    test('should throw an error when the preprocess fails', async () => {
      vi.spyOn(getAuthorizedUser, 'default').mockReturnValue(err(new Error('getAuthorizedUser error')));
      const response = await testServer.executeOperation(
        {
          query: MUTATION_UPDATE_USER,
          variables: { input },
        },
        contextMock,
      );
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors?.[0].message).toBe('getAuthorizedUser error');
    });
    test('should throw an error when the workflow fails', async () => {
      vi.spyOn(updateUserWorkflow, 'default').mockImplementation(() => errAsync(new Error('updateUserWorkflow error')));
      const response = await testServer.executeOperation(
        {
          query: MUTATION_UPDATE_USER,
          variables: { input },
        },
        contextMock,
      );
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors?.[0].message).toBe('updateUserWorkflow error');
    });
  });
});
