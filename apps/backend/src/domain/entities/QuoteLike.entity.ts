import { MongoId } from '../objects/mongoId/MongoId.object';

interface QuoteLike {
  _id: MongoId;
  userId: MongoId;
  createdAt: Date;
  updatedAt: Date;
}

export default QuoteLike;
