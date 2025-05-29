import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { User } from '../domain/entities/User.entity';
import { Quote } from '../domain/entities/Quote.entity';
import { Context } from '../types/interfaces/Context.interface';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
};

export enum GqlCacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC',
}

export type GqlMutation = {
  __typename?: 'Mutation';
  signUp: GqlUser;
  updateUser: GqlUser;
};

export type GqlMutationSignUpArgs = {
  input: GqlSignUpUserInput;
};

export type GqlMutationUpdateUserArgs = {
  input: GqlUpdateUserInput;
};

export type GqlPageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
};

export type GqlQuery = {
  __typename?: 'Query';
  quote?: Maybe<GqlQuote>;
  quotes?: Maybe<GqlQuoteConnection>;
  randomQuote?: Maybe<GqlQuote>;
  signIn: Scalars['String']['output'];
  users?: Maybe<GqlUserConnection>;
};

export type GqlQueryQuoteArgs = {
  id: Scalars['ID']['input'];
};

export type GqlQueryQuotesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
};

export type GqlQuerySignInArgs = {
  input: GqlSignInUserInput;
};

export type GqlQueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
};

export type GqlQuote = {
  __typename?: 'Quote';
  _id: Scalars['ID']['output'];
  author: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  isReviewed: Scalars['Boolean']['output'];
  reports: Array<GqlQuoteReport>;
  status: GqlQuoteStatus;
  updatedAt: Scalars['Date']['output'];
  user: GqlUser;
};

export type GqlQuoteConnection = {
  __typename?: 'QuoteConnection';
  edges?: Maybe<Array<Maybe<GqlQuoteEdge>>>;
  pageInfo?: Maybe<GqlPageInfo>;
};

export type GqlQuoteEdge = {
  __typename?: 'QuoteEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<GqlQuote>;
};

export type GqlQuoteReport = {
  __typename?: 'QuoteReport';
  _id: Scalars['ID']['output'];
  comment: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  status: GqlQuoteReportStatus;
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export enum GqlQuoteReportStatus {
  Declined = 'Declined',
  Resolved = 'Resolved',
  Unreviewed = 'Unreviewed',
}

export enum GqlQuoteStatus {
  Published = 'Published',
  Unpublished = 'Unpublished',
}

export type GqlSignInUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type GqlSignUpUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type GqlUpdateUserInput = {
  password: Scalars['String']['input'];
};

export type GqlUser = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  password: Scalars['String']['output'];
  status: GqlUserStatus;
};

export type GqlUserConnection = {
  __typename?: 'UserConnection';
  edges?: Maybe<Array<Maybe<GqlUserEdge>>>;
  pageInfo?: Maybe<GqlPageInfo>;
};

export type GqlUserEdge = {
  __typename?: 'UserEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<GqlUser>;
};

export enum GqlUserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type GqlResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CacheControlScope: GqlCacheControlScope;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  PageInfo: ResolverTypeWrapper<GqlPageInfo>;
  Query: ResolverTypeWrapper<{}>;
  Quote: ResolverTypeWrapper<Quote>;
  QuoteConnection: ResolverTypeWrapper<
    Omit<GqlQuoteConnection, 'edges'> & { edges?: Maybe<Array<Maybe<GqlResolversTypes['QuoteEdge']>>> }
  >;
  QuoteEdge: ResolverTypeWrapper<Omit<GqlQuoteEdge, 'node'> & { node?: Maybe<GqlResolversTypes['Quote']> }>;
  QuoteReport: ResolverTypeWrapper<GqlQuoteReport>;
  QuoteReportStatus: GqlQuoteReportStatus;
  QuoteStatus: GqlQuoteStatus;
  SignInUserInput: GqlSignInUserInput;
  SignUpUserInput: GqlSignUpUserInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateUserInput: GqlUpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserConnection: ResolverTypeWrapper<
    Omit<GqlUserConnection, 'edges'> & { edges?: Maybe<Array<Maybe<GqlResolversTypes['UserEdge']>>> }
  >;
  UserEdge: ResolverTypeWrapper<Omit<GqlUserEdge, 'node'> & { node?: Maybe<GqlResolversTypes['User']> }>;
  UserStatus: GqlUserStatus;
};

/** Mapping between all available schema types and the resolvers parents */
export type GqlResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Date: Scalars['Date']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  PageInfo: GqlPageInfo;
  Query: {};
  Quote: Quote;
  QuoteConnection: Omit<GqlQuoteConnection, 'edges'> & {
    edges?: Maybe<Array<Maybe<GqlResolversParentTypes['QuoteEdge']>>>;
  };
  QuoteEdge: Omit<GqlQuoteEdge, 'node'> & { node?: Maybe<GqlResolversParentTypes['Quote']> };
  QuoteReport: GqlQuoteReport;
  SignInUserInput: GqlSignInUserInput;
  SignUpUserInput: GqlSignUpUserInput;
  String: Scalars['String']['output'];
  UpdateUserInput: GqlUpdateUserInput;
  User: User;
  UserConnection: Omit<GqlUserConnection, 'edges'> & {
    edges?: Maybe<Array<Maybe<GqlResolversParentTypes['UserEdge']>>>;
  };
  UserEdge: Omit<GqlUserEdge, 'node'> & { node?: Maybe<GqlResolversParentTypes['User']> };
};

export type GqlCacheControlDirectiveArgs = {
  inheritMaxAge?: Maybe<Scalars['Boolean']['input']>;
  maxAge?: Maybe<Scalars['Int']['input']>;
  scope?: Maybe<GqlCacheControlScope>;
};

export type GqlCacheControlDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = GqlCacheControlDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GqlRateLimitDirectiveArgs = {
  duration?: Scalars['Int']['input'];
  limit?: Scalars['Int']['input'];
};

export type GqlRateLimitDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = GqlRateLimitDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface GqlDateScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes['Date'], any> {
  name: 'Date';
}

export type GqlMutationResolvers<
  ContextType = Context,
  ParentType extends GqlResolversParentTypes['Mutation'] = GqlResolversParentTypes['Mutation'],
> = {
  signUp?: Resolver<GqlResolversTypes['User'], ParentType, ContextType, RequireFields<GqlMutationSignUpArgs, 'input'>>;
  updateUser?: Resolver<
    GqlResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<GqlMutationUpdateUserArgs, 'input'>
  >;
};

export type GqlPageInfoResolvers<
  ContextType = Context,
  ParentType extends GqlResolversParentTypes['PageInfo'] = GqlResolversParentTypes['PageInfo'],
> = {
  endCursor?: Resolver<Maybe<GqlResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<Maybe<GqlResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlQueryResolvers<
  ContextType = Context,
  ParentType extends GqlResolversParentTypes['Query'] = GqlResolversParentTypes['Query'],
> = {
  quote?: Resolver<Maybe<GqlResolversTypes['Quote']>, ParentType, ContextType, RequireFields<GqlQueryQuoteArgs, 'id'>>;
  quotes?: Resolver<
    Maybe<GqlResolversTypes['QuoteConnection']>,
    ParentType,
    ContextType,
    RequireFields<GqlQueryQuotesArgs, 'first'>
  >;
  randomQuote?: Resolver<Maybe<GqlResolversTypes['Quote']>, ParentType, ContextType>;
  signIn?: Resolver<GqlResolversTypes['String'], ParentType, ContextType, RequireFields<GqlQuerySignInArgs, 'input'>>;
  users?: Resolver<
    Maybe<GqlResolversTypes['UserConnection']>,
    ParentType,
    ContextType,
    RequireFields<GqlQueryUsersArgs, 'first'>
  >;
};

export type GqlQuoteResolvers<
  ContextType = Context,
  ParentType extends GqlResolversParentTypes['Quote'] = GqlResolversParentTypes['Quote'],
> = {
  _id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  author?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<GqlResolversTypes['Date'], ParentType, ContextType>;
  isReviewed?: Resolver<GqlResolversTypes['Boolean'], ParentType, ContextType>;
  reports?: Resolver<Array<GqlResolversTypes['QuoteReport']>, ParentType, ContextType>;
  status?: Resolver<GqlResolversTypes['QuoteStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<GqlResolversTypes['Date'], ParentType, ContextType>;
  user?: Resolver<GqlResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlQuoteConnectionResolvers<
  ContextType = Context,
  ParentType extends GqlResolversParentTypes['QuoteConnection'] = GqlResolversParentTypes['QuoteConnection'],
> = {
  edges?: Resolver<Maybe<Array<Maybe<GqlResolversTypes['QuoteEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<Maybe<GqlResolversTypes['PageInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlQuoteEdgeResolvers<
  ContextType = Context,
  ParentType extends GqlResolversParentTypes['QuoteEdge'] = GqlResolversParentTypes['QuoteEdge'],
> = {
  cursor?: Resolver<Maybe<GqlResolversTypes['String']>, ParentType, ContextType>;
  node?: Resolver<Maybe<GqlResolversTypes['Quote']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlQuoteReportResolvers<
  ContextType = Context,
  ParentType extends GqlResolversParentTypes['QuoteReport'] = GqlResolversParentTypes['QuoteReport'],
> = {
  _id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  comment?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<GqlResolversTypes['QuoteReportStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlUserResolvers<
  ContextType = Context,
  ParentType extends GqlResolversParentTypes['User'] = GqlResolversParentTypes['User'],
> = {
  _id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  emailVerified?: Resolver<GqlResolversTypes['Boolean'], ParentType, ContextType>;
  password?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<GqlResolversTypes['UserStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlUserConnectionResolvers<
  ContextType = Context,
  ParentType extends GqlResolversParentTypes['UserConnection'] = GqlResolversParentTypes['UserConnection'],
> = {
  edges?: Resolver<Maybe<Array<Maybe<GqlResolversTypes['UserEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<Maybe<GqlResolversTypes['PageInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlUserEdgeResolvers<
  ContextType = Context,
  ParentType extends GqlResolversParentTypes['UserEdge'] = GqlResolversParentTypes['UserEdge'],
> = {
  cursor?: Resolver<Maybe<GqlResolversTypes['String']>, ParentType, ContextType>;
  node?: Resolver<Maybe<GqlResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlResolvers<ContextType = Context> = {
  Date?: GraphQLScalarType;
  Mutation?: GqlMutationResolvers<ContextType>;
  PageInfo?: GqlPageInfoResolvers<ContextType>;
  Query?: GqlQueryResolvers<ContextType>;
  Quote?: GqlQuoteResolvers<ContextType>;
  QuoteConnection?: GqlQuoteConnectionResolvers<ContextType>;
  QuoteEdge?: GqlQuoteEdgeResolvers<ContextType>;
  QuoteReport?: GqlQuoteReportResolvers<ContextType>;
  User?: GqlUserResolvers<ContextType>;
  UserConnection?: GqlUserConnectionResolvers<ContextType>;
  UserEdge?: GqlUserEdgeResolvers<ContextType>;
};

export type GqlDirectiveResolvers<ContextType = Context> = {
  cacheControl?: GqlCacheControlDirectiveResolver<any, any, ContextType>;
  rateLimit?: GqlRateLimitDirectiveResolver<any, any, ContextType>;
};
