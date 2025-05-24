import { Result, ok, err } from 'neverthrow';
import { Newtype, iso } from 'newtype-ts';
import { z } from 'zod';
import { type ValidationError, fromZodError } from 'zod-validation-error';

export type QuoteAuthor = Newtype<{ readonly QuoteAuthor: unique symbol }, string>;

const QuoteAuthorSchema = z.string().min(1, 'This is not a valid quote author.');

export function QuoteAuthor(quoteAuthor: string): Result<QuoteAuthor, ValidationError> {
  const result = QuoteAuthorSchema.safeParse(quoteAuthor);

  if (!result.success) {
    return err(fromZodError(result.error, { prefix: null }));
  }

  return ok(iso<QuoteAuthor>().wrap(quoteAuthor));
}
