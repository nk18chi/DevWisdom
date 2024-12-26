import { GraphQLResolveInfo } from 'graphql';
import { User } from '../entities/User.entity';
import { Context } from '../interfaces/Context.interface';
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
};

export enum GqlCacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC',
}

export type GqlCreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type GqlMutation = {
  __typename?: 'Mutation';
  createUser: GqlUser;
  updateUser: GqlUser;
};

export type GqlMutationCreateUserArgs = {
  input: GqlCreateUserInput;
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
  getUsers?: Maybe<Array<Maybe<GqlUser>>>;
  userToken?: Maybe<Scalars['String']['output']>;
  users?: Maybe<GqlUserConnection>;
};

export type GqlQueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
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
  CreateUserInput: GqlCreateUserInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  PageInfo: ResolverTypeWrapper<GqlPageInfo>;
  Query: ResolverTypeWrapper<{}>;
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
  CreateUserInput: GqlCreateUserInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  PageInfo: GqlPageInfo;
  Query: {};
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

export type GqlMutationResolvers<
  ContextType = Context,
  ParentType extends GqlResolversParentTypes['Mutation'] = GqlResolversParentTypes['Mutation'],
> = {
  createUser?: Resolver<
    GqlResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<GqlMutationCreateUserArgs, 'input'>
  >;
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
  getUsers?: Resolver<Maybe<Array<Maybe<GqlResolversTypes['User']>>>, ParentType, ContextType>;
  userToken?: Resolver<Maybe<GqlResolversTypes['String']>, ParentType, ContextType>;
  users?: Resolver<
    Maybe<GqlResolversTypes['UserConnection']>,
    ParentType,
    ContextType,
    RequireFields<GqlQueryUsersArgs, 'first'>
  >;
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
  Mutation?: GqlMutationResolvers<ContextType>;
  PageInfo?: GqlPageInfoResolvers<ContextType>;
  Query?: GqlQueryResolvers<ContextType>;
  User?: GqlUserResolvers<ContextType>;
  UserConnection?: GqlUserConnectionResolvers<ContextType>;
  UserEdge?: GqlUserEdgeResolvers<ContextType>;
};

export type GqlDirectiveResolvers<ContextType = Context> = {
  cacheControl?: GqlCacheControlDirectiveResolver<any, any, ContextType>;
  rateLimit?: GqlRateLimitDirectiveResolver<any, any, ContextType>;
};
