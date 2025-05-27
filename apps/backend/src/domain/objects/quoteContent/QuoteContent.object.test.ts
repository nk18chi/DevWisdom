import { describe, it, expect } from 'vitest';
import { QuoteContent } from './QuoteContent.object';

describe('QuoteContent', () => {
  describe('QuoteContent constructor', () => {
    it('should create a valid QuoteContent from a valid string', () => {
      const validQuoteContent = 'test content';
      const result = QuoteContent(validQuoteContent);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(validQuoteContent);
      }
    });

    it('should return error for invalid QuoteContent format', () => {
      const invalidQuoteContent = '';
      const result = QuoteContent(invalidQuoteContent);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe('quote content must be at least 10 characters long');
      }
    });

    it('should handle null or undefined input', () => {
      const nullResult = QuoteContent(null as any);
      const undefinedResult = QuoteContent(undefined as any);

      expect(nullResult.isErr()).toBe(true);
      expect(undefinedResult.isErr()).toBe(true);
      if (nullResult.isErr() && undefinedResult.isErr()) {
        expect(nullResult.error.message).toBe('Expected string, received null');
        expect(undefinedResult.error.message).toBe('Required');
      }
    });
  });
});
