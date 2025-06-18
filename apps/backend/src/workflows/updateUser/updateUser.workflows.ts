import { err, ok, okAsync, Result, ResultAsync } from 'neverthrow';
import { RawPassword } from '../../domain/objects/rawPassword/RawPassword.object';
import { HashingPassword } from '../../domain/objects/hashingPassword/HashingPassword.object';
import User, { UpdatedUser } from '../../domain/entities/User.entity';
import { DisplayName } from '../../domain/objects/displayName/DisplayName.object';

interface InvalidatedUserInput {
  password: string;
  displayName: string;
}

interface ValidatedUserInput {
  password: RawPassword;
  displayName: DisplayName;
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
  const displayNameResult = DisplayName(command.input.displayName);
  const values = Result.combine([passwordResult, displayNameResult]);

  if (values.isErr()) {
    return err(values.error);
  }
  const [password, displayName] = values.value;

  return ok({
    input: {
      password,
      displayName,
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
    displayName: command.input.displayName,
    password,
  }));
};

// workflow: invalidatedUserCommand => validatedUserCommand => updatedUser
type UpdateUserWorkflow = (_command: InvalidatedUserCommand) => ResultAsync<UpdatedUser, Error>;
const updateUserWorkflow: UpdateUserWorkflow = (command) =>
  okAsync(command).andThen(validatedUserCommand).andThen(updatedUser);

export default updateUserWorkflow;
