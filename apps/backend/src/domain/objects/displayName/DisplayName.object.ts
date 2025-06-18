import { Result, ok, err } from 'neverthrow';
import { Newtype, iso } from 'newtype-ts';
import { z } from 'zod';
import { type ValidationError, fromZodError } from 'zod-validation-error';

export type DisplayName = Newtype<{ readonly DisplayName: unique symbol }, string>;

const DisplayNameSchema = z.string().min(1, 'This is not a valid display name.');

export function DisplayName(displayName: string): Result<DisplayName, ValidationError> {
  const result = DisplayNameSchema.safeParse(displayName);

  if (!result.success) {
    return err(fromZodError(result.error, { prefix: null }));
  }

  return ok(iso<DisplayName>().wrap(displayName));
}
