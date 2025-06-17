import { ok } from 'neverthrow';
import { DEFAULT_PAGE_SIZE } from '../../../config/constants';
import User, { ValidatedUser } from '../../../domain/entities/User.entity';
import QuoteModel from '../../../infrastructure/repositories/quote/Quote.schema';
import validatedUserWorkflow from '../../../workflows/validatedUser/validatedUser.workflows';
import { GqlResolvers } from '../../types';
import { Types } from 'mongoose';

const quotesResolver: GqlResolvers = {
  Query: {
    quote: async (_, { id }) => QuoteModel.findById(id).lean(),
  },
  Quote: {
    user: async (quote, _, context): Promise<ValidatedUser> => {
      const { userDataLoader } = context.dataLoaders;
      const user = await userDataLoader.load(new Types.ObjectId(quote.userId.toString()));
      if (!user) throw new Error('User not found');
      const workflow = validatedUserWorkflow;
      const result = ok(user).andThen(workflow);
      return result.match(
        (validatedUser) => validatedUser,
        (error) => {
          throw error;
        },
      );
    },
    likeCount: async (quote) => quote.likes.length,
    likedUsers: async (quote, { number }, context) => {
      const { userDataLoader } = context.dataLoaders;
      const userIds = quote.likes
        .slice(0, number ?? DEFAULT_PAGE_SIZE)
        .map((like) => new Types.ObjectId(like.userId.toString()));
      const users = await userDataLoader.loadMany(userIds);
      return users.filter((user): user is User => user !== null);
    },
  },
};

export default quotesResolver;
