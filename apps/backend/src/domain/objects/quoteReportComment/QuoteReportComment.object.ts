import { Result, ok, err } from 'neverthrow';
import { Newtype, iso } from 'newtype-ts';
import { z } from 'zod';
import { type ValidationError, fromZodError } from 'zod-validation-error';

export type QuoteReportComment = Newtype<{ readonly QuoteReportComment: unique symbol }, string>;

const QuoteReportCommentSchema = z.string().min(10, 'quote report comment must be at least 10 characters long');

export function QuoteReportComment(quoteReportComment: string): Result<QuoteReportComment, ValidationError> {
  const result = QuoteReportCommentSchema.safeParse(quoteReportComment);

  if (!result.success) {
    return err(fromZodError(result.error, { prefix: null }));
  }

  return ok(iso<QuoteReportComment>().wrap(quoteReportComment));
}
