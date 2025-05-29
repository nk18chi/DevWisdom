import { test, describe, vi, expect, beforeEach, assert } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { rateLimitDirective } from 'graphql-rate-limit-directive';
import { Types } from 'mongoose';
import Context from '../../../types/interfaces/Context.interface';
import typeDefs from '../../schemas';
import resolvers from '../../resolvers';
import { GET_QUERY_RANDOM_QUOTE } from './randomQuote.gql';
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

const randomQuoteMock: any = [
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

describe('randomQuote.resolver.ts', async () => {
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
    vi.spyOn(QuoteModel, 'aggregate').mockReturnValue(randomQuoteMock as any);
    vi.spyOn(UserModel, 'find').mockReturnValue({ lean: vi.fn().mockReturnValue([userMock]) } as any);
    vi.stubEnv('JWT_PRIVATE_KEY', 'testJWTPrivateKey');
  });
  describe('randomQuote query', () => {
    test('should call randomQuote', async () => {
      const response = await testServer.executeOperation<{ randomQuote: IQuote }>(
        {
          query: GET_QUERY_RANDOM_QUOTE,
          variables: {},
        },
        contextMock,
      );
      expect(QuoteModel.aggregate).toHaveBeenCalledWith([
        { $match: { status: QuoteStatus.Published, isReviewed: true } },
        { $sample: { size: 1 } },
      ]);
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.randomQuote).toBeDefined();
    });
    test('should return null if any quote is not found', async () => {
      vi.spyOn(QuoteModel, 'aggregate').mockReturnValue([] as any);
      const response = await testServer.executeOperation<{ randomQuote: IQuote }>(
        {
          query: GET_QUERY_RANDOM_QUOTE,
          variables: {},
        },
        contextMock,
      );
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.randomQuote).toBeNull();
    });
    test('should call quotes without authorization', async () => {
      const response = await testServer.executeOperation<{ quotes: GqlQuoteConnection }>(
        {
          query: GET_QUERY_RANDOM_QUOTE,
          variables: {},
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
