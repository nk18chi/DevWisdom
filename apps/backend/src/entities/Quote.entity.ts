import QuoteReportStatus from '../enums/QuoteReportStatus';
import QuoteStatus from '../enums/QuoteStatus';
import { MongoId } from '../objects/MongoId.object';
import { QuoteAuthor } from '../objects/QuoteAuthor.object';
import { QuoteContent } from '../objects/QuoteContent.object';
import { QuoteReportComment } from '../objects/QuoteReportComment.object';

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

export { CreatedQuote, UpdatedQuote, Quote, QuoteReport };
export default Quote;
