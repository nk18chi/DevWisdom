import { err, ok, okAsync, Result, ResultAsync } from 'neverthrow';
import { RawPassword } from '../../domain/objects/rawPassword/RawPassword.object';
import { HashingPassword } from '../../domain/objects/hashingPassword/HashingPassword.object';
import User, { UpdatedUser } from '../../domain/entities/User.entity';
import { DisplayName } from '../../domain/objects/displayName/DisplayName.object';
import { Avatar } from '../../domain/objects/avatar/avatar.object';

interface InvalidatedUserInput {
  password: string;
  displayName: string;
  avatar?: string;
}

interface ValidatedUserInput {
  password: RawPassword;
  displayName: DisplayName;
  avatar?: Avatar;
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
  const avatarResult = command.input.avatar ? Avatar(command.input.avatar) : ok(undefined);
  const values = Result.combine([passwordResult, displayNameResult, avatarResult]);

  if (values.isErr()) {
    return err(values.error);
  }
  const [password, displayName, avatar] = values.value;

  return ok({
    input: {
      password,
      displayName,
      avatar,
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
    avatar: command.input.avatar,
  }));
};

// workflow: invalidatedUserCommand => validatedUserCommand => updatedUser
type UpdateUserWorkflow = (_command: InvalidatedUserCommand) => ResultAsync<UpdatedUser, Error>;
const updateUserWorkflow: UpdateUserWorkflow = (command) =>
  okAsync(command).andThen(validatedUserCommand).andThen(updatedUser);

export default updateUserWorkflow;
