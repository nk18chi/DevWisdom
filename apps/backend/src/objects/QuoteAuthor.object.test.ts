import { describe, it, expect } from 'vitest';
import { QuoteAuthor } from './QuoteAuthor.object';

describe('QuoteAuthor', () => {
  describe('QuoteAuthor constructor', () => {
    it('should create a valid QuoteAuthor from a valid string', () => {
      const validQuoteAuthor = 'test author';
      const result = QuoteAuthor(validQuoteAuthor);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(validQuoteAuthor);
      }
    });

    it('should return error for invalid QuoteAuthor format', () => {
      const invalidQuoteAuthor = '';
      const result = QuoteAuthor(invalidQuoteAuthor);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe('This is not a valid quote author.');
      }
    });

    it('should handle null or undefined input', () => {
      const nullResult = QuoteAuthor(null as any);
      const undefinedResult = QuoteAuthor(undefined as any);

      expect(nullResult.isErr()).toBe(true);
      expect(undefinedResult.isErr()).toBe(true);
      if (nullResult.isErr() && undefinedResult.isErr()) {
        expect(nullResult.error.message).toBe('Expected string, received null');
        expect(undefinedResult.error.message).toBe('Required');
      }
    });
  });
});
