import { describe, it, expect } from 'vitest';
import { QuoteReportComment } from './QuoteReportComment.object';

describe('QuoteReportComment', () => {
  describe('QuoteReportComment constructor', () => {
    it('should create a valid QuoteReportComment from a valid string', () => {
      const validQuoteReportComment = 'test comment';
      const result = QuoteReportComment(validQuoteReportComment);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(validQuoteReportComment);
      }
    });

    it('should return error for invalid QuoteReportComment format', () => {
      const invalidQuoteReportComment = '';
      const result = QuoteReportComment(invalidQuoteReportComment);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe('quote report comment must be at least 10 characters long');
      }
    });

    it('should handle null or undefined input', () => {
      const nullResult = QuoteReportComment(null as any);
      const undefinedResult = QuoteReportComment(undefined as any);

      expect(nullResult.isErr()).toBe(true);
      expect(undefinedResult.isErr()).toBe(true);
      if (nullResult.isErr() && undefinedResult.isErr()) {
        expect(nullResult.error.message).toBe('Expected string, received null');
        expect(undefinedResult.error.message).toBe('Required');
      }
    });
  });
});
