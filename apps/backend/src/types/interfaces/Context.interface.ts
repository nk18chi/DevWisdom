import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { BaseContext } from '@apollo/server';
import IUser, { AuthorizedUser } from '../../domain/entities/User.entity';

export interface Context extends BaseContext {
  user?: AuthorizedUser;
  dataLoaders: {
    userDataLoader: DataLoader<Types.ObjectId, IUser, Types.ObjectId>;
  };
}

export default Context;
