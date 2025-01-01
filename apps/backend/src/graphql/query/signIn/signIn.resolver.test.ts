import { test, describe, vi, expect, assert, beforeEach } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { rateLimitDirective } from 'graphql-rate-limit-directive';
import { errAsync, okAsync } from 'neverthrow';
import Context from '../../../interfaces/Context.interface';
import typeDefs from '../../schemas';
import resolvers from '../../resolvers';
import permissions from '../../authorizations/permissions';
import User from '../../../entities/User.entity';
import { GqlUserStatus } from '../../types';
import { MongoId } from '../../../objects/MongoId.object';
import QUERY_SIGN_IN from './signIn.gql';
import { Email } from '../../../objects/Email.object';
import { HashingPassword } from '../../../objects/HashingPassword.object';
import * as userRepository from '../../../repositories/user/User.repository';
import * as signInUserWorkflow from '../../../workflows/signIn.workflows';

const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } = rateLimitDirective();

const usersMock: User = {
  _id: MongoId('666a86b3ee5b217b01281a39')._unsafeUnwrap(),
  email: Email('alice@example.com')._unsafeUnwrap(),
  emailVerified: true,
  status: GqlUserStatus.Active,
  password: '$2b$10$KlgmTHTsWMWDBMVuPuBtDeQAMehb7eDBfhIlzLGfeRpb1rhFD4GK2' as unknown as HashingPassword,
};

// vi.mock('../../../workflows/signIn.workflows', () => ({
//   __esModule: true,
//   default: vi.fn().mockImplementation(() => okAsync('token')),
// }));

describe('signIn.resolver.ts', async () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.advanceTimersByTime(1000 * 60 * 5); // 5 minutes;
    vi.spyOn(userRepository, 'getUserByEmail').mockReturnValue(okAsync(usersMock));
    vi.spyOn(signInUserWorkflow, 'default').mockReturnValue(okAsync('token') as unknown as any);
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

  describe('signIn query', () => {
    test('should return token when email and password are correct', async () => {
      const response = await testServer.executeOperation({
        query: QUERY_SIGN_IN,
        variables: {
          input: {
            email: 'john3@example.com',
            password: 'OIY*(YPJP(*$R#rqavr3241',
          },
        },
      });
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data).toEqual({
        signIn: 'token',
      });
    });
    test('should throw an error when email is formatted incorrectly', async () => {
      const response = await testServer.executeOperation({
        query: QUERY_SIGN_IN,
        variables: {
          input: {
            email: 'john',
            password: 'OIY*(YPJP(*$R#rqavr3241',
          },
        },
      });
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors?.[0].message).toBe('This is not a valid email.');
    });
    test('should throw an error when an user is not found by the email', async () => {
      vi.spyOn(userRepository, 'getUserByEmail').mockReturnValue(errAsync(new Error('User not found')));
      const response = await testServer.executeOperation({
        query: QUERY_SIGN_IN,
        variables: {
          input: {
            email: 'john3@example.com',
            password: 'OIY*(YPJP(*$',
          },
        },
      });
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors?.[0].message).toBe('Email or Password is incorrect');
    });
    test('should throw an error when too many requests are made', async () => {
      await Promise.all(
        Array(5)
          .fill(null)
          .map(async () => {
            const response = await testServer.executeOperation({
              query: QUERY_SIGN_IN,
              variables: {
                input: {
                  email: 'john3@example.com',
                  password: 'OIY*(YPJP(*$',
                },
              },
            });
            assert(response.body.kind === 'single');
            expect(response.body.singleResult.errors).toBeUndefined();
          }),
      );
      const response = await testServer.executeOperation({
        query: QUERY_SIGN_IN,
        variables: {
          input: {
            email: 'john3@example.com',
            password: 'OIY*(YPJP(*$',
          },
        },
      });
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors?.[0].message).toMatch(
        /Too many requests, please try again in [0-9]+ seconds\./,
      );
    });
    test('should throw an error when signInWorkflow fails', async () => {
      vi.spyOn(signInUserWorkflow, 'default').mockReturnValue(errAsync(new Error('signInUserWorkflow Error')));
      const response = await testServer.executeOperation({
        query: QUERY_SIGN_IN,
        variables: {
          input: {
            email: 'john3@example.com',
            password: 'OIY*(YPJP(*$R#rqavr3241',
          },
        },
      });
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors?.[0].message).toBe('signInUserWorkflow Error');
    });
  });
});
