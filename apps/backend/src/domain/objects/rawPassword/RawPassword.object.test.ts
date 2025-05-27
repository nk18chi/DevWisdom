import { describe, it, expect } from 'vitest';
import { RawPassword } from './RawPassword.object';

const errorMessage =
  'Password must be more than eight letters and contain at least one uppercase letter, one lowercase letter, one number, and one special character';

describe('RawPassword', () => {
  describe('RawPassword constructor', () => {
    it('should create a valid RawPassword when input meets requirements', () => {
      const validPassword = 'StrongP@ssw0rd';
      const result = RawPassword(validPassword);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(validPassword);
      }
    });

    it('should return error for password shorter than minimum length', () => {
      const shortPassword = 'Abc123!';
      const result = RawPassword(shortPassword);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toContain(errorMessage);
      }
    });

    it('should return error for password missing required characters', () => {
      const noUpperCase = 'password123!';
      const noLowerCase = 'PASSWORD123!';
      const noNumber = 'PasswordABC!';
      const noSpecial = 'Password123';

      const results = [
        RawPassword(noUpperCase),
        RawPassword(noLowerCase),
        RawPassword(noNumber),
        RawPassword(noSpecial),
      ];

      results.forEach((result) => {
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error.message).toContain(errorMessage);
        }
      });
    });

    it('should handle empty string', () => {
      const emptyResult = RawPassword('');
      expect(emptyResult.isErr()).toBe(true);
      if (emptyResult.isErr()) {
        expect(emptyResult.error.message).toBe('Password is required');
      }
    });
  });
});
