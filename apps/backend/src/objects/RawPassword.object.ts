import { Result, ok, err } from 'neverthrow';
import { Newtype, iso } from 'newtype-ts';
import { z } from 'zod';
import { type ValidationError, fromZodError } from 'zod-validation-error';
import { isStrongPassword } from 'validator';

export type RawPassword = Newtype<{ readonly RawPassword: unique symbol }, string>;

const RawPasswordSchema = z.string().min(1, { message: 'Password is required' });

export function RawPassword(password: string): Result<RawPassword, ValidationError | Error> {
  const result = RawPasswordSchema.safeParse(password);

  if (!result.success) {
    return err(fromZodError(result.error, { prefix: null }));
  }

  if (!isStrongPassword(password)) {
    return err(
      new Error(
        // eslint-disable-next-line max-len
        'Password must be more than eight letters and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    );
  }

  return ok(iso<RawPassword>().wrap(password));
}
