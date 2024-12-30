import { GqlUserStatus } from '../graphql/types';
import { Email } from '../objects/Email.object';
import { HashingPassword } from '../objects/HashingPassword.object';
import { MongoId } from '../objects/MongoId.object';

interface User {
  _id: MongoId;
  email: Email;
  emailVerified: boolean;
  status: GqlUserStatus;
  password: HashingPassword;
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
}

interface UpdatedUser {
  _id: MongoId;
  password: HashingPassword;
}

interface AuthorizedUser {
  _id: MongoId;
}

export { CreatedUser, UpdatedUser, User, AuthorizedUser, SignedInUser };
export default User;
