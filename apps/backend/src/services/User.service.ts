import { err, ok, Result } from 'neverthrow';
import Context from '../interfaces/Context.interface';
import { AuthorizedUser } from '../entities/User.entity';

export function getAuthorizedUser(context: Context): Result<AuthorizedUser, Error> {
  if (!context.user) {
    return err(new Error('User is not authorized'));
  }
  return ok(context.user);
}

export default getAuthorizedUser;
