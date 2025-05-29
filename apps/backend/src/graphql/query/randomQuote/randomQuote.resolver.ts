import QuoteModel from '../../../infrastructure/repositories/quote/Quote.schema';
import QuoteStatus from '../../../types/enums/QuoteStatus';
import { GqlResolvers } from '../../types';

const randomQuoteResolver: GqlResolvers = {
  Query: {
    randomQuote: async () => {
      const result = await QuoteModel.aggregate([
        { $match: { status: QuoteStatus.Published, isReviewed: true } },
        { $sample: { size: 1 } },
      ]);
      if (result.length === 0) {
        return null;
      }
      return result[0];
    },
  },
};

export default randomQuoteResolver;
