import QuoteReportStatus from '../../types/enums/QuoteReportStatus';
import { MongoId } from '../objects/mongoId/MongoId.object';
import { QuoteReportComment } from '../objects/quoteReportComment/QuoteReportComment.object';

interface QuoteReport {
  _id: MongoId;
  comment: QuoteReportComment;
  userId: MongoId;
  status: QuoteReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

export default QuoteReport;
