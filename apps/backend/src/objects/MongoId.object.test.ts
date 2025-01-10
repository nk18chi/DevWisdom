import { describe, it, expect } from 'vitest';
import { MongoId } from './MongoId.object';

describe('MongoId', () => {
  describe('MongoId constructor', () => {
    it('should create a valid MongoId from a valid MongoDB ObjectId string', () => {
      const validMongoId = '507f1f77bcf86cd799439011';
      const result = MongoId(validMongoId);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(validMongoId);
      }
    });

    it('should return error for invalid MongoDB ObjectId format', () => {
      const invalidMongoId = '';
      const result = MongoId(invalidMongoId);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe('Invalid input');
      }
    });

    it('should handle null or undefined input', () => {
      const nullResult = MongoId(null as any);
      const undefinedResult = MongoId(undefined as any);

      expect(nullResult.isErr()).toBe(true);
      expect(undefinedResult.isErr()).toBe(true);
      if (nullResult.isErr() && undefinedResult.isErr()) {
        expect(nullResult.error.message).toBe('Expected string, received null');
        expect(undefinedResult.error.message).toBe('Required');
      }
    });
  });
});
