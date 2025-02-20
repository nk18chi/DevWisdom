import { Types } from 'mongoose';
import { Result, ResultAsync, okAsync, errAsync } from 'neverthrow';
import { GqlUserStatus } from '../graphql/types';
import { Email } from '../objects/Email.object';
import { RawPassword } from '../objects/RawPassword.object';
import { HashingPassword } from '../objects/HashingPassword.object';
import { CreatedUser } from '../entities/User.entity';
import { MongoId } from '../objects/MongoId.object';

interface InvalidatedUser {
  email: string;
  password: string;
}

interface ValidatedUser {
  email: Email;
  password: RawPassword;
}

type ValidatedUserResult = (_model: InvalidatedUser) => Result<ValidatedUser, Error>;

const validatedUser: ValidatedUserResult = (model) => {
  const emailResult = Email(model.email);
  const passwordResult = RawPassword(model.password);
  const values = Result.combine([emailResult, passwordResult]);
  return values.map(([email, password]) => ({
    email,
    password,
  }));
};

type CreatedUserResult = (_model: ValidatedUser) => ResultAsync<CreatedUser, Error>;
const createdUser: CreatedUserResult = (model) => {
  const mongoIdResult = MongoId(new Types.ObjectId().toString());
  const values = Result.combine([mongoIdResult]);
  if (values.isErr()) return errAsync(values.error);
  const [mongoId] = values.value;

  const hashingPasswordResult = HashingPassword(model.password);
  const asyncValues = ResultAsync.combine([hashingPasswordResult]);

  return asyncValues.map(([hashingPassword]) => ({
    ...model,
    _id: mongoId,
    status: GqlUserStatus.Active as const,
    emailVerified: false as const,
    password: hashingPassword,
  }));
};

// workflow: invalidatedUser => validatedUser => createdUser
type signUpWorkflow = (_model: InvalidatedUser) => ResultAsync<CreatedUser, Error>;
const signUpWorkflow: signUpWorkflow = (model) => okAsync(model).andThen(validatedUser).andThen(createdUser);

export default signUpWorkflow;
