import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { MongoId } from '../../objects/MongoId.object';
import { Email } from '../../objects/Email.object';
import { HashingPassword } from '../../objects/HashingPassword.object';
import {
  findUserById,
  findUserByEmail,
  getUserById,
  getUserByEmail,
  saveCreatedUser,
  updateUser,
} from './User.repository';
import UserModel from './User.schema';
import { CreatedUser, UpdatedUser } from '../../entities/User.entity';
import { GqlUserStatus } from '../../graphql/types';

describe('User Repository', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  const mockUser = {
    email: 'test@example.com' as unknown as Email,
    password: 'hashedPassword123' as unknown as HashingPassword,
    firstName: 'John',
    lastName: 'Doe',
  };

  describe('findUserById', () => {
    it('should find user by id', async () => {
      const createdUser = await UserModel.create(mockUser);
      const result = await findUserById(MongoId(createdUser._id.toString())._unsafeUnwrap()).match(
        (user) => user,
        (err) => {
          throw err;
        },
      );
      expect(result?.email).toBe(mockUser.email.toString());
    });

    it('should return null when user not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await findUserById(MongoId(nonExistentId.toString())._unsafeUnwrap()).match(
        (user) => user,
        (err) => {
          throw err;
        },
      );
      expect(result).toBeNull();
    });
  });

  describe('findUserByEmail', () => {
    it('should find user by email', async () => {
      await UserModel.create(mockUser);
      const result = await findUserByEmail(Email(mockUser.email.toString())._unsafeUnwrap()).match(
        (user) => user,
        (err) => {
          throw err;
        },
      );

      expect(result?.email).toBe(mockUser.email.toString());
    });

    it('should return null when email not found', async () => {
      const result = await findUserByEmail(Email('nonexistent@example.com')._unsafeUnwrap()).match(
        (user) => user,
        (err) => {
          throw err;
        },
      );
      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      const createdUser = await UserModel.create(mockUser);
      const result = await getUserById(MongoId(createdUser._id.toString())._unsafeUnwrap()).match(
        (user) => user,
        (err) => {
          throw err;
        },
      );
      expect(result.email).toBe(mockUser.email.toString());
    });

    it('should throw error when user not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await getUserById(MongoId(nonExistentId.toString())._unsafeUnwrap()).match(
        (user) => user,
        (err) => err,
      );
      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toBe('Database Error: User not found');
    });
  });

  describe('getUserByEmail', () => {
    it('should get user by email', async () => {
      await UserModel.create(mockUser);
      const result = await getUserByEmail(Email(mockUser.email.toString())._unsafeUnwrap()).match(
        (user) => user,
        (err) => {
          throw err;
        },
      );
      expect(result.email).toBe(mockUser.email.toString());
    });

    it('should throw error when email not found', async () => {
      const result = await getUserByEmail(Email('nonexistent@example.com')._unsafeUnwrap()).match(
        (user) => user,
        (err) => err,
      );
      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toBe('Database Error: User not found');
    });
  });

  describe('saveCreatedUser', () => {
    it('should save new user', async () => {
      const newUser: CreatedUser = {
        _id: MongoId('123456789012345678901234')._unsafeUnwrap(),
        email: Email('new@example.com')._unsafeUnwrap(),
        password: 'hashedPassword123' as unknown as HashingPassword,
        emailVerified: false,
        status: GqlUserStatus.Active,
      };
      const result = await saveCreatedUser(newUser).match(
        (user) => user,
        (err) => {
          throw err;
        },
      );
      expect(result.email).toBe(newUser.email.toString());
    });
  });

  describe('updateUser', () => {
    it('should update existing user', async () => {
      const createdUser = await UserModel.create(mockUser);
      const updatedData: UpdatedUser = {
        _id: MongoId(createdUser._id.toString())._unsafeUnwrap(),
        password: 'newHashedPassword123' as unknown as HashingPassword,
      };

      const result = await updateUser(updatedData).match(
        (user) => user,
        (err) => {
          throw err;
        },
      );
      expect(result.password).toBe(updatedData.password);
    });

    it('should throw error when updating non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updatedData: UpdatedUser = {
        _id: MongoId(nonExistentId.toString())._unsafeUnwrap(),
        password: 'newHashedPassword123' as unknown as HashingPassword,
      };

      const result = await updateUser(updatedData).match(
        (user) => user,
        (err) => err,
      );

      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toBe('Database Error: User not found');
    });
  });
});
