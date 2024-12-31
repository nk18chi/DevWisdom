import { test, describe, vi, expect, beforeEach, assert } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { rateLimitDirective } from 'graphql-rate-limit-directive';
import { Types } from 'mongoose';
import Context from '../../../interfaces/Context.interface';
import typeDefs from '../../schemas';
import resolvers from '../../resolvers';
import User from '../../../repositories/user/User.schema';
import { GET_QUERY_USERS } from '../../query/users/users.gql';
import permissions from '../../authorizations/permissions';
import IUser from '../../../entities/User.entity';
import { GqlUserConnection } from '../../types';
import { MongoId } from '../../../objects/MongoId.object';
import userDataLoader from '../../../dataloader/User.dataLoader';

const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } = rateLimitDirective();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const usersMock: any = [
  {
    _id: '666a86b3ee5b217b01281a39',
    name: 'Alice',
    email: 'alice@example.com',
  },
  {
    _id: '666a86b3ee5b217b01281a3a',
    name: 'Bob',
    email: 'bob@example.com',
  },
  {
    _id: '666a86b3ee5b217b01281a3a',
    name: 'Charlie',
    email: 'charlie@example.com',
  },
];
const contextMock = {
  contextValue: {
    user: {
      _id: MongoId(new Types.ObjectId().toString())._unsafeUnwrap(),
    },
    dataLoaders: { userDataLoader },
  },
};

describe('signUp.resolver.ts', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let chainableMock: any = {};
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
  const pagination = 2;

  beforeEach(() => {
    chainableMock = {
      lean: vi.fn().mockReturnValue(usersMock),
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    };
    vi.spyOn(User, 'find').mockReturnValue(chainableMock);
    vi.stubEnv('JWT_PRIVATE_KEY', 'testJWTPrivateKey');
  });
  describe('users query', () => {
    test('should call users with first variable', async () => {
      const response = await testServer.executeOperation<{ users: GqlUserConnection }>(
        {
          query: GET_QUERY_USERS,
          variables: { first: pagination },
        },
        contextMock,
      );
      expect(User.find).toHaveBeenCalledWith({});
      expect(chainableMock.sort).toHaveBeenCalledWith({ _id: 1 });
      expect(chainableMock.limit).toHaveBeenCalledWith(pagination + 1);
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.users).toEqual({
        edges: usersMock.slice(0, -1).map((user: IUser) => ({
          cursor: user._id,
          node: expect.any(Object),
        })),
        pageInfo: {
          endCursor: usersMock[usersMock.length - 2]._id,
          hasNextPage: true,
        },
      });
    });
    test('should call users with first and after variables', async () => {
      const response = await testServer.executeOperation<{ users: GqlUserConnection }>(
        {
          query: GET_QUERY_USERS,
          variables: { first: pagination, after: 'lastCursorId' },
        },
        contextMock,
      );
      expect(User.find).toHaveBeenCalledWith({ _id: { $gt: 'lastCursorId' } });
      expect(chainableMock.sort).toHaveBeenCalledWith({ _id: 1 });
      expect(chainableMock.limit).toHaveBeenCalledWith(pagination + 1);
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
    });
    test('should set hasNextPage as false when there is no next page', async () => {
      const response = await testServer.executeOperation<{ users: GqlUserConnection }>(
        {
          query: GET_QUERY_USERS,
          variables: { first: usersMock.length + 1, after: 'lastCursorId' },
        },
        contextMock,
      );
      expect(User.find).toHaveBeenCalledWith({ _id: { $gt: 'lastCursorId' } });
      expect(chainableMock.sort).toHaveBeenCalledWith({ _id: 1 });
      expect(chainableMock.limit).toHaveBeenCalledWith(usersMock.length + 1 + 1);
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.users.pageInfo?.hasNextPage).toBe(false);
    });
    test('should not call users without authorization', async () => {
      const response = await testServer.executeOperation<{ users: GqlUserConnection }>(
        {
          query: GET_QUERY_USERS,
          variables: { first: pagination },
        },
        {
          contextValue: {
            ...contextMock.contextValue,
            user: undefined,
          },
        },
      );
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors?.[0].message).toEqual('Not Authorised!');
    });
  });
});
