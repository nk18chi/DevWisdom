import QuoteModel from '../../../infrastructure/repositories/quote/Quote.schema';
import { GqlResolvers } from '../../types';

const quotesResolver: GqlResolvers = {
  Query: {
    quotes: async (_, { first, after }) => {
      const query = after ? { _id: { $gt: after } } : {};
      const quotes = await QuoteModel.find(query)
        .sort({ _id: 1 })
        .limit(first + 1)
        .lean();
      const hasNextPage = quotes.length > first;
      const edges = hasNextPage ? quotes.slice(0, -1) : quotes;
      return {
        edges: edges.map((quote) => ({
          cursor: quote._id.toString(),
          node: quote,
        })),
        pageInfo: {
          endCursor: edges[edges.length - 1]?._id.toString(),
          hasNextPage,
        },
      };
    },
  },
};

export default quotesResolver;
