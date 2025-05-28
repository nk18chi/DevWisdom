import QuoteModel from '../../../infrastructure/repositories/quote/Quote.schema';
import { GqlResolvers } from '../../types';
import { Types } from 'mongoose';

const quotesResolver: GqlResolvers = {
  Query: {
    quote: async (_, { id }) => QuoteModel.findById(id).lean(),
  },
  Quote: {
    user: async (quote, _, context) => {
      const { userDataLoader } = context.dataLoaders;
      const user = await userDataLoader.load(new Types.ObjectId(quote.userId.toString()));
      if (!user) throw new Error('User not found');

      return user;
    },
  },
};

export default quotesResolver;
