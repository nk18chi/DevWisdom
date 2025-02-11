import { describe, it, expect, beforeEach, vi } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import signInUserWorkflow from './signIn.workflows';
import { GqlUserStatus } from '../graphql/types';
import { MongoId } from '../objects/MongoId.object';
import { Email } from '../objects/Email.object';
import { HashingPassword } from '../objects/HashingPassword.object';

vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('signInUserWorkflow', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
    vi.spyOn(jwt, 'sign').mockImplementation(() => 'eyJhbGciOiJIUzI1NiIs');
  });

  const mockCommand = {
    input: {
      email: 'test@example.com',
      password: 'OIY*(YPJP(*$R#rqavr3241',
    },
    user: {
      _id: MongoId('666a86b3ee5b217b01281a39')._unsafeUnwrap(),
      email: Email('test@example.com')._unsafeUnwrap(),
      password: '$2b$10$TH/2NF5o1l8wSMpiRTPq9.mJTR8L6U/NEipcayYpqby9g.YeP9iaK' as unknown as HashingPassword,
      status: GqlUserStatus.Active,
      emailVerified: true,
    },
  };

  it('should successfully generate user JWT token', async () => {
    const result = await signInUserWorkflow(mockCommand);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const token = result.value;
      expect(token).toBe('eyJhbGciOiJIUzI1NiIs');
      expect(bcrypt.compare).toHaveBeenCalledWith(mockCommand.input.password, mockCommand.user.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          _id: mockCommand.user._id,
          email: mockCommand.input.email,
          emailVerified: mockCommand.user.emailVerified,
          status: mockCommand.user.status,
        },
        process.env.JWT_SECRET,
      );
    }
  });

  it('should throw an error if the password is incorrect', async () => {
    vi.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
    const result = await signInUserWorkflow(mockCommand);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('Email or Password is incorrect');
    }
  });

  it('should throw an error if the user is not active', async () => {
    const result = await signInUserWorkflow({
      ...mockCommand,
      user: { ...mockCommand.user, status: GqlUserStatus.Inactive },
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('User is not active');
    }
  });

  it('should throw an error if the user is not verified', async () => {
    const result = await signInUserWorkflow({
      ...mockCommand,
      user: { ...mockCommand.user, emailVerified: false },
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('Email is not verified');
    }
  });
});
