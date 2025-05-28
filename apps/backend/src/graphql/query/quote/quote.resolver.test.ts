import { test, describe, vi, expect, beforeEach, assert } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { rateLimitDirective } from 'graphql-rate-limit-directive';
import { Types } from 'mongoose';
import Context from '../../../types/interfaces/Context.interface';
import typeDefs from '../../schemas';
import resolvers from '../../resolvers';
import Quote from '../../../infrastructure/repositories/quote/Quote.schema';
import { GET_QUERY_QUOTE } from './quote.gql';
import permissions from '../../authorizations/permissions';
import IQuote from '../../../domain/entities/Quote.entity';
import { GqlQuoteConnection } from '../../types';
import { MongoId } from '../../../domain/objects/mongoId/MongoId.object';
import userDataLoader from '../../../config/dataloader/User.dataLoader';
import QuoteStatus from '../../../types/enums/QuoteStatus';
import QuoteReportStatus from '../../../types/enums/QuoteReportStatus';
import UserModel from '../../../infrastructure/repositories/user/User.schema';
import QuoteModel from '../../../infrastructure/repositories/quote/Quote.schema';

const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } = rateLimitDirective();

const quoteMock: any = {
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
};

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

describe('quote.resolver.ts', async () => {
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

  beforeEach(() => {
    chainableQuoteMock = {
      lean: vi.fn().mockReturnValue(quoteMock),
    };
    vi.spyOn(QuoteModel, 'findById').mockReturnValue(chainableQuoteMock);
    vi.spyOn(UserModel, 'find').mockReturnValue({ lean: vi.fn().mockReturnValue([userMock]) } as any);
    vi.stubEnv('JWT_PRIVATE_KEY', 'testJWTPrivateKey');
  });
  describe('quote query', () => {
    test('should call quote with id variable', async () => {
      const response = await testServer.executeOperation<{ quote: IQuote }>(
        {
          query: GET_QUERY_QUOTE,
          variables: { id: quoteMock._id },
        },
        contextMock,
      );
      expect(Quote.findById).toHaveBeenCalledWith(quoteMock._id);
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.quote).toBeDefined();
    });
    test('should return null if quote is not found', async () => {
      vi.spyOn(QuoteModel, 'findById').mockReturnValue({
        lean: vi.fn().mockReturnValue(null),
      } as any);
      const id = '666666666666666666666666';
      const response = await testServer.executeOperation<{ quote: IQuote }>(
        {
          query: GET_QUERY_QUOTE,
          variables: { id },
        },
        contextMock,
      );
      expect(Quote.findById).toHaveBeenCalledWith(id);
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.quote).toBeNull();
    });
    test('should call quotes without authorization', async () => {
      const response = await testServer.executeOperation<{ quotes: GqlQuoteConnection }>(
        {
          query: GET_QUERY_QUOTE,
          variables: { id: quoteMock._id },
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
  });
});
