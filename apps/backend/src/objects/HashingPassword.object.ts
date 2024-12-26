import { Result, ok, err } from 'neverthrow';
import { Newtype, iso } from 'newtype-ts';
import { z } from 'zod';
import { type ValidationError, fromZodError } from 'zod-validation-error';
import { RawPassword } from './RawPassword.object';

export type HashingPassword = Newtype<{ readonly HashingPassword: unique symbol }, string>;

// TODO: Add password validation
const HashingPasswordSchema = z.string();

export function HashingPassword(password: RawPassword): Result<HashingPassword, ValidationError> {
  const result = HashingPasswordSchema.safeParse(password);

  if (!result.success) {
    return err(fromZodError(result.error));
  }

  return ok(iso<HashingPassword>().wrap(password.toString()));
}
