import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Newtype, iso } from 'newtype-ts';
import { z } from 'zod';
import { type ValidationError, fromZodError } from 'zod-validation-error';
import bcrypt from 'bcrypt';
import { RawPassword } from '../rawPassword/RawPassword.object';

const saltRounds = 10;

export type HashingPassword = Newtype<{ readonly HashingPassword: unique symbol }, string>;

const HashingPasswordSchema = z.string().min(1, { message: 'RawPassword is required' });

export function HashingPassword(password: RawPassword): ResultAsync<HashingPassword, ValidationError | Error> {
  const result = HashingPasswordSchema.safeParse(password.toString());

  if (!result.success) {
    return errAsync(fromZodError(result.error, { prefix: null }));
  }

  return ResultAsync.fromPromise(bcrypt.hash(password.toString(), saltRounds), (err) => err as Error).andThen((hash) =>
    okAsync(iso<HashingPassword>().wrap(hash)),
  );
}
