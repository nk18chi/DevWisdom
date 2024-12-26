import { Types } from 'mongoose';
import { ok, Result } from 'neverthrow';
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

type ValidatedUserResult = (model: InvalidatedUser) => Result<ValidatedUser, Error>;

const validatedUser: ValidatedUserResult = (model) => {
  const emailResult = Email(model.email);
  const passwordResult = RawPassword(model.password);
  const values = Result.combine([emailResult, passwordResult]);

  return values.map(([email, password]) => ({
    email,
    password,
  }));
};

type CreatedUserResult = (model: ValidatedUser) => Result<CreatedUser, Error>;

const createdUser: CreatedUserResult = (model) => {
  const mongoIdResult = MongoId(new Types.ObjectId().toString());
  const hashingPasswordResult = HashingPassword(model.password);
  const values = Result.combine([mongoIdResult, hashingPasswordResult]);

  return values.map(([_id, hashingPassword]) => ({
    ...model,
    _id,
    status: GqlUserStatus.Active,
    emailVerified: false,
    password: hashingPassword,
  }));
};

// workflow: invalidatedUser => validatedUser => createdUser
type CreateUserWorkflow = (model: InvalidatedUser) => Result<CreatedUser, Error>;
const createUserWorkflow: CreateUserWorkflow = (model) => ok(model).andThen(validatedUser).andThen(createdUser);

export default createUserWorkflow;
