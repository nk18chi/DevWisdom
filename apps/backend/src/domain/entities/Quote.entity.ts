import QuoteReportStatus from '../../types/enums/QuoteReportStatus';
import QuoteStatus from '../../types/enums/QuoteStatus';
import { MongoId } from '../objects/mongoId/MongoId.object';
import { QuoteAuthor } from '../objects/QuoteAuthor/QuoteAuthor.object';
import { QuoteContent } from '../objects/quoteContent/QuoteContent.object';
import { QuoteReportComment } from '../objects/quoteReportComment/QuoteReportComment.object';

interface QuoteReport {
  _id: MongoId;
  comment: QuoteReportComment;
  userId: MongoId;
  status: QuoteReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface Quote {
  _id: MongoId;
  content: QuoteContent;
  author: QuoteAuthor;
  tagIds: MongoId[];
  commentIds: MongoId[];
  likes: MongoId[];
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
  isReviewed: boolean;
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
