import { GqlUserStatus } from '../../graphql/types';
import { Avatar } from '../objects/avatar/avatar.object';
import { DisplayName } from '../objects/displayName/DisplayName.object';
import { Email } from '../objects/email/Email.object';
import { HashingPassword } from '../objects/hashingPassword/HashingPassword.object';
import { MongoId } from '../objects/mongoId/MongoId.object';

interface User {
  _id: MongoId;
  displayName?: DisplayName;
  email: Email;
  emailVerified: boolean;
  status: GqlUserStatus;
  password: HashingPassword;
  avatar?: Avatar;
}

interface CreatedUser {
  _id: MongoId;
  email: Email;
  emailVerified: false;
  password: HashingPassword;
  status: GqlUserStatus.Active;
}

interface SignedInUser {
  _id: MongoId;
  email: Email;
  emailVerified: true;
  status: GqlUserStatus.Active;
  avatar?: string;
}

interface UpdatedUser {
  _id: MongoId;
  displayName: DisplayName;
  password: HashingPassword;
  avatar?: Avatar;
}

interface AuthorizedUser {
  _id: MongoId;
}

export { CreatedUser, UpdatedUser, User, AuthorizedUser, SignedInUser };
export default User;
