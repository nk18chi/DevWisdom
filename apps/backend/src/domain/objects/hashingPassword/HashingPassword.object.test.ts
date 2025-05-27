import { describe, it, expect, vi } from 'vitest';
import bcrypt from 'bcrypt';
import { ok } from 'neverthrow';
import { HashingPassword } from './HashingPassword.object';
import { RawPassword } from '../rawPassword/RawPassword.object';

vi.mock('./RawPassword.object', () => ({
  RawPassword: vi.fn((value: string) =>
    ok({
      toString: () => value,
      _tag: 'RawPassword',
    }),
  ),
}));

describe('HashingPassword', () => {
  it('should successfully hash a valid password', async () => {
    const validPassword = 'StrongP@ssw0rd';
    const rawPassword = RawPassword(validPassword)._unsafeUnwrap();
    const result = await HashingPassword(rawPassword);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const isValidHash = await bcrypt.compare(validPassword, result.value.toString());
      expect(isValidHash).toBe(true);
    }
  });

  it('should fail when given an empty password', async () => {
    const emptyPassword = '';
    const result = await HashingPassword(emptyPassword as unknown as RawPassword);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toHaveProperty('message', 'RawPassword is required');
    }
  });

  it('should generate different hashes for the same password', async () => {
    const password = 'SamePassword123';
    const hash1 = await HashingPassword(password as unknown as RawPassword);
    const hash2 = await HashingPassword(password as unknown as RawPassword);

    expect(hash1.isOk()).toBe(true);
    expect(hash2.isOk()).toBe(true);
    if (hash1.isOk() && hash2.isOk()) {
      expect(hash1.value.toString()).not.toBe(hash2.value.toString());
    }
  });

  it('should handle bcrypt errors gracefully', async () => {
    const validPassword = 'TestPassword123';
    vi.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.reject(new Error('Bcrypt error')));

    const result = await HashingPassword(validPassword as unknown as RawPassword);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe('Bcrypt error');
    }
  });
});
