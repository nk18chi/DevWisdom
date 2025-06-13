import { Result, err, ok } from 'neverthrow';
import Quote, { RandomQuote } from '../../domain/entities/Quote.entity';
import QuoteStatus from '../../types/enums/QuoteStatus';

type RandomQuoteResult = (_model: Quote) => Result<RandomQuote, Error>;

const randomQuote: RandomQuoteResult = (model) => {
  if (model.status !== QuoteStatus.Published) {
    return err(new Error('Quote is not published'));
  }
  if (!model.isReviewed) {
    return err(new Error('Quote is not reviewed'));
  }

  return ok({
    ...model,
    status: model.status,
    isReviewed: model.isReviewed,
  });
};

// workflow: Quote => RandomQuote
type RandomQuoteWorkflow = (_model: Quote) => Result<RandomQuote, Error>;
const randomQuoteWorkflow: RandomQuoteWorkflow = (model) => ok(model).andThen(randomQuote);

export default randomQuoteWorkflow;
