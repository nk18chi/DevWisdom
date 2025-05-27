import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { JWTToken, createSignedInUserJWTToken } from './JWTToken.object';
import { SignedInUser } from '../../entities/User.entity';
import { MongoId } from '../mongoId/MongoId.object';
import { Email } from '../email/Email.object';
import { GqlUserStatus } from '../../../graphql/types';

// Mock jwt
vi.mock('jsonwebtoken');

describe('JWTToken', () => {
  describe('JWTToken constructor', () => {
    it('should create a valid JWTToken from a valid JWT string', () => {
      const validToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';

      const result = JWTToken(validToken);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(validToken);
      }
    });

    it('should return error for invalid JWT format', () => {
      const invalidToken = 'invalid-token';

      const result = JWTToken(invalidToken);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toContain('Invalid');
      }
    });
  });

  describe('createSignedInUserJWTToken', () => {
    beforeEach(() => {
      vi.spyOn(jwt, 'sign').mockImplementation(() => 'eyJ.mock.token');
    });

    it('should create a valid JWT token from SignedInUser', () => {
      const mockMongoId = MongoId('507f1f77bcf86cd799439011')._unsafeUnwrap();
      const mockSignedInUser: SignedInUser = {
        _id: mockMongoId,
        email: Email('test@example.com')._unsafeUnwrap(),
        emailVerified: true,
        status: GqlUserStatus.Active,
      };

      const result = createSignedInUserJWTToken(mockSignedInUser);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(jwt.sign).toHaveBeenCalledWith(mockSignedInUser, process.env.JWT_PRIVATE_KEY);
        expect(result.value).toBe('eyJ.mock.token');
      }
    });
  });
});
