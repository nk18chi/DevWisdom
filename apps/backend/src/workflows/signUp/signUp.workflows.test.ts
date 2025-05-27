import { describe, expect, it, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import signUpWorkflow from './signUp.workflows';
import { GqlUserStatus } from '../../graphql/types';

vi.mock('mongoose');

describe('signUpWorkflow', () => {
  beforeEach(() => {
    vi.spyOn(mongoose.Types.ObjectId, 'isValid').mockImplementation(() => true);
    vi.spyOn(mongoose.Types.ObjectId.prototype, 'toString').mockImplementation(() => '507f1f77bcf86cd799439011');
  });

  const mockUser = {
    email: 'test@example.com',
    password: 'OIY*(YPJP(*$R#rqavr3241',
  };
  it('should create a valid user when given valid input', async () => {
    const result = await signUpWorkflow(mockUser);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({
        _id: expect.any(String),
        email: mockUser.email,
        password: expect.any(String),
        status: GqlUserStatus.Active,
        emailVerified: false,
      });
    }
  });

  it('should return error for invalid email', async () => {
    const result = await signUpWorkflow({
      ...mockUser,
      email: 'invalid-email',
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toContain('This is not a valid email');
    }
  });

  it('should return error for invalid mongoId', async () => {
    vi.spyOn(mongoose.Types.ObjectId, 'isValid').mockImplementation(() => false);
    const result = await signUpWorkflow(mockUser);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toContain('Invalid input');
    }
  });
});
