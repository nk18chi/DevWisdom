import { describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import updateUserWorkflow from './updateUser.workflows';
import User from '../entities/User.entity';
import { MongoId } from '../objects/MongoId.object';
import { Email } from '../objects/Email.object';
import { HashingPassword } from '../objects/HashingPassword.object';
import { GqlUserStatus } from '../graphql/types';

describe('updateUserWorkflow', () => {
  const mockUser: User = {
    _id: MongoId(new mongoose.Types.ObjectId().toString())._unsafeUnwrap(),
    email: Email('test@example.com')._unsafeUnwrap(),
    password: '$2b$10$TH/2NF5o1l8wSMpiRTPq9.mJTR8L6U/NEipcayYpqby9g.YeP9iaK' as unknown as HashingPassword,
    emailVerified: true,
    status: GqlUserStatus.Active,
  };

  describe('when input is valid', () => {
    it('should successfully update user password', async () => {
      const command = {
        input: {
          password: 'NewValidPass123!',
        },
        user: mockUser,
      };
      const result = await updateUserWorkflow(command);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const updatedUser = result.value;
        expect(updatedUser._id).toEqual(mockUser._id);
        expect(updatedUser.password).toBeDefined();
        expect(updatedUser.password).not.toBe('NewValidPass123!'); // Should be hashed
        expect(updatedUser.password).not.toBe(mockUser.password); // Should be different from old password
      }
    });
  });

  describe('when input is invalid', () => {
    it('should fail with error for password too short', async () => {
      const command = {
        input: {
          password: 'short',
        },
        user: mockUser,
      };
      const result = await updateUserWorkflow(command);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
      }
    });

    it('should fail with error for password without uppercase', async () => {
      const command = {
        input: {
          password: 'nouppercasepass123!',
        },
        user: mockUser,
      };
      const result = await updateUserWorkflow(command);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
      }
    });

    it('should fail with error for password without special character', async () => {
      const command = {
        input: {
          password: 'NoSpecialChar123',
        },
        user: mockUser,
      };
      const result = await updateUserWorkflow(command);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
      }
    });
  });
});
