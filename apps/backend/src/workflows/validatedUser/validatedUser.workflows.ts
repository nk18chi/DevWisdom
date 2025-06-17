import { Result, err, ok } from 'neverthrow';
import User, { ValidatedUser } from '../../domain/entities/User.entity';
import { GqlUserStatus } from '../../graphql/types';

type ValidatedUserResult = (_model: User) => Result<ValidatedUser, Error>;

const validatedUser: ValidatedUserResult = (model) => {
  if (!model.emailVerified) {
    return err(new Error('User is not verified'));
  }

  if (model.status !== GqlUserStatus.Active) {
    return err(new Error('User is not active'));
  }

  return ok({
    ...model,
    emailVerified: true,
    status: GqlUserStatus.Active,
  });
};

// workflow: User => ValidatedUser
type ValidatedUserWorkflow = (_model: User) => Result<ValidatedUser, Error>;
const validatedUserWorkflow: ValidatedUserWorkflow = (model) => ok(model).andThen(validatedUser);

export default validatedUserWorkflow;
