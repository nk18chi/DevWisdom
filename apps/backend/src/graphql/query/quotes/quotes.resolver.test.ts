import { test, describe, vi, expect, beforeEach, assert } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { rateLimitDirective } from 'graphql-rate-limit-directive';
import { Types } from 'mongoose';
import Context from '../../../interfaces/Context.interface';
import typeDefs from '../../schemas';
import resolvers from '../../resolvers';
import Quote from '../../../repositories/quote/Quote.schema';
import { GET_QUERY_QUOTES } from './quotes.gql';
import permissions from '../../authorizations/permissions';
import IQuote from '../../../entities/Quote.entity';
import { GqlQuoteConnection } from '../../types';
import { MongoId } from '../../../objects/MongoId.object';
import userDataLoader from '../../../dataloader/User.dataLoader';
import QuoteStatus from '../../../enums/QuoteStatus';
import QuoteReportStatus from '../../../enums/QuoteReportStatus';
import UserModel from '../../../repositories/user/User.schema';
import QuoteModel from '../../../repositories/quote/Quote.schema';

const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } = rateLimitDirective();

const quotesMock: any = [
  {
    _id: '666a86b3ee5b217b01281a39',
    content: 'quote content 1',
    author: 'author 1',
    tagIds: ['666a86b3ee5b217b01281a30'],
    commentIds: ['666a86b3ee5b217b01281a31'],
    likes: ['666a86b3ee5b217b01281a32'],
    favorites: ['666a86b3ee5b217b01281a33'],
    reports: [
      {
        _id: '666a86b3ee5b217b01281a34',
        comment: 'comment 1',
        userId: '666a86b3ee5b217b01281a35',
        status: QuoteReportStatus.Unreviewed,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    userId: '666a86b3ee5b217b01281a35',
    status: QuoteStatus.Published,
    isReviewed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '666a86b3ee5b217b01281a3a',
    content: 'quote content 2',
    author: 'author 2',
    userId: '666a86b3ee5b217b01281a35',
    tagIds: ['666a86b3ee5b217b01281a30'],
    commentIds: ['666a86b3ee5b217b01281a31'],
    status: QuoteStatus.Unpublished,
    reports: [],
    isReviewed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '666a86b3ee5b217b01281a3b',
    content: 'quote content 3',
    author: 'author 3',
    userId: '666a86b3ee5b217b01281a35',
    tagIds: [],
    commentIds: [],
    status: QuoteStatus.Published,
    isReviewed: true,
    reports: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
const userMock: any = {
  _id: '666a86b3ee5b217b01281a35',
  email: 'test@test.com',
};

const contextMock = {
  contextValue: {
    user: {
      _id: MongoId(new Types.ObjectId().toString())._unsafeUnwrap(),
    },
    dataLoaders: { userDataLoader },
  },
};

describe('quotes.resolver.ts', async () => {
  let chainableQuoteMock: any = {};
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
    chainableQuoteMock = {
      lean: vi.fn().mockReturnValue(quotesMock),
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    };
    vi.spyOn(QuoteModel, 'find').mockReturnValue(chainableQuoteMock);
    vi.spyOn(UserModel, 'find').mockReturnValue({ lean: vi.fn().mockReturnValue([userMock]) } as any);
    vi.stubEnv('JWT_PRIVATE_KEY', 'testJWTPrivateKey');
  });
  describe('quotes query', () => {
    test('should call quotes with first variable', async () => {
      const response = await testServer.executeOperation<{ quotes: GqlQuoteConnection }>(
        {
          query: GET_QUERY_QUOTES,
          variables: { first: pagination },
        },
        contextMock,
      );
      expect(Quote.find).toHaveBeenCalledWith({});
      expect(chainableQuoteMock.sort).toHaveBeenCalledWith({ _id: 1 });
      expect(chainableQuoteMock.limit).toHaveBeenCalledWith(pagination + 1);
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.quotes).toEqual({
        edges: quotesMock.slice(0, -1).map((quote: IQuote) => ({
          cursor: quote._id,
          node: expect.any(Object),
        })),
        pageInfo: {
          endCursor: quotesMock[quotesMock.length - 2]._id,
          hasNextPage: true,
        },
      });
    });
    test('should call quotes with first and after variables', async () => {
      const response = await testServer.executeOperation<{ quotes: GqlQuoteConnection }>(
        {
          query: GET_QUERY_QUOTES,
          variables: { first: pagination, after: 'lastCursorId' },
        },
        contextMock,
      );
      expect(Quote.find).toHaveBeenCalledWith({ _id: { $gt: 'lastCursorId' } });
      expect(chainableQuoteMock.sort).toHaveBeenCalledWith({ _id: 1 });
      expect(chainableQuoteMock.limit).toHaveBeenCalledWith(pagination + 1);
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
    });
    test('should set hasNextPage as false when there is no next page', async () => {
      const response = await testServer.executeOperation<{ quotes: GqlQuoteConnection }>(
        {
          query: GET_QUERY_QUOTES,
          variables: { first: quotesMock.length + 1, after: 'lastCursorId' },
        },
        contextMock,
      );
      expect(Quote.find).toHaveBeenCalledWith({ _id: { $gt: 'lastCursorId' } });
      expect(chainableQuoteMock.sort).toHaveBeenCalledWith({ _id: 1 });
      expect(chainableQuoteMock.limit).toHaveBeenCalledWith(quotesMock.length + 1 + 1);
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.quotes.pageInfo?.hasNextPage).toBe(false);
    });
    test('should call quotes without authorization', async () => {
      const response = await testServer.executeOperation<{ quotes: GqlQuoteConnection }>(
        {
          query: GET_QUERY_QUOTES,
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
      expect(response.body.singleResult.errors).toBeUndefined();
    });
    test('should throw error when the user of quote is not found', async () => {
      vi.spyOn(userDataLoader, 'load').mockResolvedValue(null as any);
      const response = await testServer.executeOperation<{ quotes: GqlQuoteConnection }>(
        {
          query: GET_QUERY_QUOTES,
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
      expect(response.body.singleResult.errors?.[0].message).toBe('User not found');
    });
  });
});
