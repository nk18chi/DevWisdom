import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { MongoId } from '../../objects/MongoId.object';
import { findQuoteById, getQuoteById, saveCreatedQuote, updateQuote } from './Quote.repository';
import QuoteModel from './Quote.schema';
import QuoteStatus from '../../enums/QuoteStatus';
import { UpdatedQuote } from '../../entities/Quote.entity';
import { QuoteContent } from '../../objects/QuoteContent.object';
import { QuoteAuthor } from '../../objects/QuoteAuthor.object';

describe('Quote Repository', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await QuoteModel.deleteMany({});
  });

  const mockQuote = {
    _id: MongoId('123456789012345678901234')._unsafeUnwrap(),
    content: 'test content' as unknown as QuoteContent,
    author: 'test author' as unknown as QuoteAuthor,
    status: QuoteStatus.Published,
    userId: MongoId('123456789012345678901111')._unsafeUnwrap(),
  };

  describe('findQuoteById', () => {
    it('should find quote by id', async () => {
      const createdQuote = await QuoteModel.create(mockQuote);
      const result = await findQuoteById(MongoId(createdQuote._id.toString())._unsafeUnwrap()).match(
        (quote) => quote,
        (err) => {
          throw err;
        },
      );
      expect(result).toMatchObject({
        ...mockQuote,
        _id: new mongoose.Types.ObjectId(mockQuote._id.toString()),
        userId: new mongoose.Types.ObjectId(mockQuote.userId.toString()),
      });
    });

    it('should return null when quote not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await findQuoteById(MongoId(nonExistentId.toString())._unsafeUnwrap()).match(
        (quote) => quote,
        (err) => {
          throw err;
        },
      );
      expect(result).toBeNull();
    });
  });

  describe('getQuoteById', () => {
    it('should get quote by id', async () => {
      const createdQuote = await QuoteModel.create(mockQuote);
      const result = await getQuoteById(MongoId(createdQuote._id.toString())._unsafeUnwrap()).match(
        (quote) => quote,
        (err) => {
          throw err;
        },
      );
      expect(result).toMatchObject({
        ...mockQuote,
        _id: new mongoose.Types.ObjectId(mockQuote._id.toString()),
        userId: new mongoose.Types.ObjectId(mockQuote.userId.toString()),
      });
    });

    it('should throw error when quote not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await getQuoteById(MongoId(nonExistentId.toString())._unsafeUnwrap()).match(
        (quote) => quote,
        (err) => err,
      );
      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toBe('Database Error: Quote not found');
    });
  });

  describe('saveCreatedQuote', () => {
    it('should save new quote', async () => {
      const result = await saveCreatedQuote(mockQuote).match(
        (quote) => quote,
        (err) => {
          throw err;
        },
      );
      expect(result).toMatchObject({
        ...mockQuote,
        _id: new mongoose.Types.ObjectId(mockQuote._id.toString()),
        userId: new mongoose.Types.ObjectId(mockQuote.userId.toString()),
      });
    });
  });

  describe('updateQuote', () => {
    it('should update existing quote', async () => {
      const createdQuote = await QuoteModel.create(mockQuote);
      const updatedData: UpdatedQuote = {
        _id: MongoId(createdQuote._id.toString())._unsafeUnwrap(),
        content: 'updated content',
        author: 'updated author',
        status: QuoteStatus.Unpublished,
      };

      const result = await updateQuote(updatedData).match(
        (quote) => quote,
        (err) => {
          throw err;
        },
      );
      expect(result).toMatchObject({
        ...updatedData,
        _id: new mongoose.Types.ObjectId(updatedData._id.toString()),
      });
    });

    it('should throw error when updating non-existent quote', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updatedData: UpdatedQuote = {
        _id: MongoId(nonExistentId.toString())._unsafeUnwrap(),
        content: 'updated content',
        author: 'updated author',
        status: QuoteStatus.Unpublished,
      };

      const result = await updateQuote(updatedData).match(
        (quote) => quote,
        (err) => err,
      );

      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toBe('Database Error: Quote not found');
    });
  });
});
