import { model, Schema } from 'mongoose';
import { GqlUserStatus } from '../../graphql/types';
import { User } from '../../entities/User.entity';

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, required: true, default: false },
    password: { type: String, required: true },
    status: { type: String, required: true, enum: GqlUserStatus, default: GqlUserStatus.Active },
  },
  { timestamps: true },
);

const UserModel = model<User>('User', userSchema);

export default UserModel;
