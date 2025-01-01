import { test, describe, vi, expect, beforeEach, assert } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { rateLimitDirective } from 'graphql-rate-limit-directive';
import { errAsync, okAsync } from 'neverthrow';
import Context from '../../../interfaces/Context.interface';
import typeDefs from '../../schemas';
import resolvers from '../../resolvers';
import permissions from '../../authorizations/permissions';
import * as userRepository from '../../../repositories/user/User.repository';
import * as signUpWorkflow from '../../../workflows/signUp.workflows';
import MUTATION_SIGN_UP from './signUp.gql';

const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } = rateLimitDirective();

describe('signUp.resolver.ts', async () => {
  const mockUser: any = {
    _id: '666a86b3ee5b217b01281a39',
    email: 'john@example.com',
  };
  beforeEach(async () => {
    vi.spyOn(userRepository, 'saveCreatedUser').mockResolvedValue(okAsync(mockUser) as any);
    vi.spyOn(signUpWorkflow, 'default').mockResolvedValue(okAsync(mockUser) as any);
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
  describe('signUp mutation', () => {
    const input = {
      email: 'john3@example.com',
      password: 'OIY*(YPJP(*$R#rqavr3241',
    };
    test('should return user when the workflow is successful', async () => {
      const response = await testServer.executeOperation({
        query: MUTATION_SIGN_UP,
        variables: { input },
      });
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data).toEqual({
        signUp: mockUser,
      });
      expect(signUpWorkflow.default).toHaveBeenCalledWith(input);
      expect(userRepository.saveCreatedUser).toHaveBeenCalledWith(mockUser);
    });
    test('should throw an error when the workflow fails', async () => {
      vi.spyOn(signUpWorkflow, 'default').mockResolvedValueOnce(errAsync(new Error('signUpWorkflow error')) as any);
      const response = await testServer.executeOperation({
        query: MUTATION_SIGN_UP,
        variables: { input },
      });
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors?.[0].message).toBe('signUpWorkflow error');
    });
  });
});
