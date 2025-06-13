import { ok } from 'neverthrow';
import Quote, { RandomQuote } from '../../../domain/entities/Quote.entity';
import QuoteModel from '../../../infrastructure/repositories/quote/Quote.schema';
import QuoteStatus from '../../../types/enums/QuoteStatus';
import randomQuoteWorkflow from '../../../workflows/randomQuote/randomQuote.workflows';
import { GqlResolvers } from '../../types';

const randomQuoteResolver: GqlResolvers = {
  Query: {
    randomQuote: async (): Promise<RandomQuote | null> => {
      const quotes = await QuoteModel.aggregate<Quote>([
        { $match: { status: QuoteStatus.Published, isReviewed: true } },
        { $sample: { size: 1 } },
      ]);
      if (quotes.length === 0) {
        return null;
      }
      const workflow = randomQuoteWorkflow;
      const result = ok(quotes[0]).andThen(workflow);
      return result.match(
        (quote) => quote,
        (error) => {
          throw error;
        },
      );
    },
  },
};

export default randomQuoteResolver;
