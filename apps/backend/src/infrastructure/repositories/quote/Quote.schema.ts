import { model, Schema } from 'mongoose';
import Quote, { QuoteReport } from '../../../domain/entities/Quote.entity';
import QuoteStatus from '../../../types/enums/QuoteStatus';
import QuoteReportStatus from '../../../types/enums/QuoteReportStatus';
import QuoteLike from '../../../domain/entities/QuoteLike.entity';

const quoteReportSchema = new Schema<QuoteReport>(
  {
    comment: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, required: true, default: QuoteReportStatus.Unreviewed },
  },
  { timestamps: true },
);

const likeSchema = new Schema<QuoteLike>(
  {
    userId: { type: String, required: true },
  },
  { timestamps: true },
);

const quoteSchema = new Schema<Quote>(
  {
    content: { type: String, required: true },
    author: { type: String, required: true },
    tagIds: { type: [String], default: [] },
    commentIds: { type: [String], default: [] },
    likes: { type: [likeSchema], default: [] },
    favorites: { type: [String], default: [] },
    reports: { type: [quoteReportSchema], default: [] },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, required: true, default: QuoteStatus.Published },
    isReviewed: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

const QuoteModel = model<Quote>('Quote', quoteSchema);

export default QuoteModel;
