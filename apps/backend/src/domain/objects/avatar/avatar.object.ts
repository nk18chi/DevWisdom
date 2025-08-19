import { Result, ok, err } from 'neverthrow';
import { Newtype, iso } from 'newtype-ts';
import { z } from 'zod';
import { type ValidationError, fromZodError } from 'zod-validation-error';

export type Avatar = Newtype<{ readonly Avatar: unique symbol }, string>;

const AvatarSchema = z.string().min(1, 'avatar is required').url('This is not a valid avatar url.');

export function Avatar(avatar: string): Result<Avatar, ValidationError> {
  const result = AvatarSchema.safeParse(avatar);

  if (!result.success) {
    return err(fromZodError(result.error, { prefix: null }));
  }

  return ok(iso<Avatar>().wrap(avatar));
}
