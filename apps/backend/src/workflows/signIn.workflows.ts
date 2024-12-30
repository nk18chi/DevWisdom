import { errAsync, okAsync, Result, ResultAsync } from 'neverthrow';
import bcrypt from 'bcrypt';
import { ValidationError } from 'zod-validation-error';
import { RawPassword } from '../objects/RawPassword.object';
import User from '../entities/User.entity';
import { Email } from '../objects/Email.object';
import { GqlUserStatus } from '../graphql/types';
import { createSignedInUserJWTToken, JWTToken } from '../objects/JWTToken.object';

interface InvalidatedUserInput {
  email: string;
  password: string;
}

interface ValidatedUserInput {
  email: Email;
  password: RawPassword;
}

interface InvalidatedUserCommand {
  input: InvalidatedUserInput;
  user: User;
}

interface ValidatedUserCommand {
  input: ValidatedUserInput;
  user: User;
}

type ValidatedUseCommandResult = (command: InvalidatedUserCommand) => Result<ValidatedUserCommand, Error>;

const validatedUserCommand: ValidatedUseCommandResult = (command) => {
  const emailResult = Email(command.input.email);
  const passwordResult = RawPassword(command.input.password);
  const values = Result.combine([emailResult, passwordResult]);

  return values.map(([email, password]) => ({
    input: {
      email,
      password,
    },
    user: command.user,
  }));
};

type SignedInUserResult = (command: ValidatedUserCommand) => ResultAsync<JWTToken, ValidationError | Error>;

const signedInUser: SignedInUserResult = (command) =>
  ResultAsync.fromPromise(
    bcrypt.compare(command.input.password.toString(), command.user.password.toString()),
    (err) => err as Error,
  ).andThen((result) => {
    if (!result) {
      return errAsync(new Error('Email or Password is incorrect'));
    }
    if (command.user.status !== GqlUserStatus.Active) {
      return errAsync(new Error('User is not active'));
    }
    if (command.user.emailVerified !== true) {
      return errAsync(new Error('Email is not verified'));
    }
    return createSignedInUserJWTToken({
      _id: command.user._id,
      email: command.input.email,
      emailVerified: command.user.emailVerified,
      status: command.user.status,
    });
  });

// workflow: invalidatedUserCommand => validatedUserCommand => signedInUserJWTToken
type SignInUserWorkflow = (command: InvalidatedUserCommand) => ResultAsync<JWTToken, Error>;
const signInUserWorkflow: SignInUserWorkflow = (command) =>
  okAsync(command).andThen(validatedUserCommand).andThen(signedInUser);

export default signInUserWorkflow;
