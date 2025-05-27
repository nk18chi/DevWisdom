import { Result, ok, err } from 'neverthrow';
import { Newtype, iso } from 'newtype-ts';
import { z } from 'zod';
import { type ValidationError, fromZodError } from 'zod-validation-error';

export type QuoteContent = Newtype<{ readonly QuoteContent: unique symbol }, string>;

const QuoteContentSchema = z.string().min(10, 'quote content must be at least 10 characters long');

export function QuoteContent(quoteContent: string): Result<QuoteContent, ValidationError> {
  const result = QuoteContentSchema.safeParse(quoteContent);

  if (!result.success) {
    return err(fromZodError(result.error, { prefix: null }));
  }

  return ok(iso<QuoteContent>().wrap(quoteContent));
}
