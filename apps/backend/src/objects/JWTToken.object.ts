import { Result, ok, err } from 'neverthrow';
import { Newtype, iso } from 'newtype-ts';
import { z } from 'zod';
import { type ValidationError, fromZodError } from 'zod-validation-error';
import jwt from 'jsonwebtoken';
import { SignedInUser } from '../entities/User.entity';

export type JWTToken = Newtype<{ readonly JWTToken: unique symbol }, string>;

const JWTTokenSchema = z.string().regex(/^eyJ/);

export function JWTToken(token: string): Result<JWTToken, ValidationError> {
  const result = JWTTokenSchema.safeParse(token);

  if (!result.success) {
    return err(fromZodError(result.error, { prefix: null }));
  }

  return ok(iso<JWTToken>().wrap(token));
}

export function createSignedInUserJWTToken(signedInUser: SignedInUser): Result<JWTToken, ValidationError> {
  const tokenString = jwt.sign(signedInUser, process.env.JWT_PRIVATE_KEY);
  return JWTToken(tokenString);
}
