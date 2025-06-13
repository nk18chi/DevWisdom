import QuoteStatus from '../../types/enums/QuoteStatus';
import { MongoId } from '../objects/mongoId/MongoId.object';
import { QuoteAuthor } from '../objects/QuoteAuthor/QuoteAuthor.object';
import { QuoteContent } from '../objects/quoteContent/QuoteContent.object';
import QuoteLike from './QuoteLike.entity';
import QuoteReport from './QuoteReport.entity';

interface Quote {
  _id: MongoId;
  content: QuoteContent;
  author: QuoteAuthor;
  tagIds: MongoId[];
  commentIds: MongoId[];
  likes: QuoteLike[];
  favorites: MongoId[];
  reports: QuoteReport[];
  userId: MongoId;
  status: QuoteStatus;
  isReviewed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface RandomQuote extends Quote {
  status: QuoteStatus.Published;
  isReviewed: true;
}

interface CreatedQuote {
  _id: MongoId;
  content: QuoteContent;
  author: QuoteAuthor;
  status: QuoteStatus;
}

interface UpdatedQuote {
  _id: MongoId;
  content: string;
  author: string;
  status: QuoteStatus;
}

export { CreatedQuote, UpdatedQuote, Quote, QuoteReport, RandomQuote };
export default Quote;
