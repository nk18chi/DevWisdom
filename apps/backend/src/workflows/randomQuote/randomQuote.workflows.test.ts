import { describe, expect, it, vi } from 'vitest';
import randomQuoteWorkflow from './randomQuote.workflows';
import QuoteStatus from '../../types/enums/QuoteStatus';
import Quote from '../../domain/entities/Quote.entity';

vi.mock('mongoose');

const mockQuote = {
  _id: '507f1f77bcf86cd799439011',
  content: 'test',
  author: 'test',
  tagIds: ['test'],
  commentIds: ['test'],
  likes: 0,
  favorites: 0,
  reports: 0,
  userId: '507f1f77bcf86cd799439011',
  status: QuoteStatus.Published,
  isReviewed: true,
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as Quote;

describe('randomQuoteWorkflow', () => {
  it('should return a valid random quote when given a valid quote', () => {
    const result = randomQuoteWorkflow(mockQuote);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({
        ...mockQuote,
        status: QuoteStatus.Published,
        isReviewed: true,
      });
    }
  });

  it('should return error for invalid quote status', async () => {
    const result = randomQuoteWorkflow({
      ...mockQuote,
      status: QuoteStatus.Unpublished,
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('Quote is not published');
    }
  });

  it('should return error for invalid quote isReviewed', async () => {
    const result = randomQuoteWorkflow({
      ...mockQuote,
      isReviewed: false,
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('Quote is not reviewed');
    }
  });
});
