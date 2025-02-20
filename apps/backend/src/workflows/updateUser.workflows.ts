import { err, ok, okAsync, Result, ResultAsync } from 'neverthrow';
import { RawPassword } from '../objects/RawPassword.object';
import { HashingPassword } from '../objects/HashingPassword.object';
import User, { UpdatedUser } from '../entities/User.entity';

interface InvalidatedUserInput {
  password: string;
}

interface ValidatedUserInput {
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

type ValidatedUseCommandResult = (_command: InvalidatedUserCommand) => Result<ValidatedUserCommand, Error>;

const validatedUserCommand: ValidatedUseCommandResult = (command) => {
  const passwordResult = RawPassword(command.input.password);
  const values = Result.combine([passwordResult]);

  if (values.isErr()) {
    return err(values.error);
  }
  const [password] = values.value;

  return ok({
    input: {
      password,
    },
    user: command.user,
  });
};

type UpdatedUserResult = (_command: ValidatedUserCommand) => ResultAsync<UpdatedUser, Error>;

const updatedUser: UpdatedUserResult = (command) => {
  const hashingPasswordResult = HashingPassword(command.input.password);
  const values = ResultAsync.combine([hashingPasswordResult]);
  return values.map(([password]) => ({
    _id: command.user._id,
    password,
  }));
};

// workflow: invalidatedUserCommand => validatedUserCommand => updatedUser
type UpdateUserWorkflow = (_command: InvalidatedUserCommand) => ResultAsync<UpdatedUser, Error>;
const updateUserWorkflow: UpdateUserWorkflow = (command) =>
  okAsync(command).andThen(validatedUserCommand).andThen(updatedUser);

export default updateUserWorkflow;
