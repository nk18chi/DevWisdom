import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import QuoteModel from './Quote.schema';
import { CreatedQuote, UpdatedQuote, Quote } from '../../entities/Quote.entity';
import { MongoId } from '../../objects/MongoId.object';

export const findQuoteById = (id: MongoId): ResultAsync<Quote | null, Error> =>
  ResultAsync.fromPromise(QuoteModel.findById(id).lean(), (err) => err as Error).andThen((quote) => {
    if (!quote) return okAsync(null);
    return okAsync(quote);
  });

export const getQuoteById = (id: MongoId): ResultAsync<Quote, Error> =>
  findQuoteById(id).andThen((quote) => {
    if (!quote) return errAsync(new Error('Database Error: Quote not found'));
    return okAsync(quote);
  });

export const saveCreatedQuote = (model: CreatedQuote): ResultAsync<Quote, Error> =>
  ResultAsync.fromPromise(QuoteModel.create(model), (err) => err as Error);

export const updateQuote = (model: UpdatedQuote): ResultAsync<Quote, Error> =>
  ResultAsync.fromPromise(QuoteModel.findByIdAndUpdate(model._id, model, { new: true }), (err) => err as Error).andThen(
    (quote) => {
      if (!quote) return errAsync(new Error('Database Error: Quote not found'));
      return okAsync(quote);
    },
  );
