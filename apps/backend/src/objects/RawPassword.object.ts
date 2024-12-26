import { Result, ok, err } from 'neverthrow';
import { Newtype, iso } from 'newtype-ts';
import { z } from 'zod';
import { type ValidationError, fromZodError } from 'zod-validation-error';

export type RawPassword = Newtype<{ readonly RawPassword: unique symbol }, string>;

// TODO: Add password validation
const RawPasswordSchema = z.string();

export function RawPassword(password: string): Result<RawPassword, ValidationError> {
  const result = RawPasswordSchema.safeParse(password);

  if (!result.success) {
    return err(fromZodError(result.error));
  }

  return ok(iso<RawPassword>().wrap(password));
}
