import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import { getAuthorizedUser } from './User.service';
import { AuthorizedUser } from '../entities/User.entity';
import Context from '../interfaces/Context.interface';
import { MongoId } from '../objects/MongoId.object';

describe('User Service', () => {
  describe('getAuthorizedUser', () => {
    it('should return authorized user when context has user', () => {
      const mongoId = new mongoose.Types.ObjectId();
      const mockUser: AuthorizedUser = {
        _id: MongoId(mongoId.toString())._unsafeUnwrap(),
      };
      const context: Context = {
        user: mockUser,
        dataLoaders: {
          userDataLoader: {} as any,
        },
      };
      const result = getAuthorizedUser(context);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual(mockUser);
      }
    });

    it('should return error when context has no user', () => {
      const context: Context = {
        user: undefined,
        dataLoaders: {
          userDataLoader: {} as any,
        },
      };
      const result = getAuthorizedUser(context);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe('User is not authorized');
      }
    });
  });
});
