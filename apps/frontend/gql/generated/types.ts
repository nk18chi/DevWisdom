import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC',
}

export type Mutation = {
  __typename?: 'Mutation';
  signUp: User;
  updateUser: User;
};

export type MutationSignUpArgs = {
  input: SignUpUserInput;
};

export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
};

export type Query = {
  __typename?: 'Query';
  quote?: Maybe<Quote>;
  quotes?: Maybe<QuoteConnection>;
  randomQuote?: Maybe<Quote>;
  signIn: Scalars['String']['output'];
  users?: Maybe<UserConnection>;
};

export type QueryQuoteArgs = {
  id: Scalars['ID']['input'];
};

export type QueryQuotesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
};

export type QuerySignInArgs = {
  input: SignInUserInput;
};

export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
};

export type Quote = {
  __typename?: 'Quote';
  _id: Scalars['ID']['output'];
  author: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  isReviewed: Scalars['Boolean']['output'];
  likeCount: Scalars['Int']['output'];
  likedUsers: Array<User>;
  reports: Array<QuoteReport>;
  status: QuoteStatus;
  updatedAt: Scalars['Date']['output'];
  user: User;
};

export type QuoteLikedUsersArgs = {
  number?: InputMaybe<Scalars['Int']['input']>;
};

export type QuoteConnection = {
  __typename?: 'QuoteConnection';
  edges?: Maybe<Array<Maybe<QuoteEdge>>>;
  pageInfo?: Maybe<PageInfo>;
};

export type QuoteEdge = {
  __typename?: 'QuoteEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Quote>;
};

export type QuoteReport = {
  __typename?: 'QuoteReport';
  _id: Scalars['ID']['output'];
  comment: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  status: QuoteReportStatus;
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export enum QuoteReportStatus {
  Declined = 'Declined',
  Resolved = 'Resolved',
  Unreviewed = 'Unreviewed',
}

export enum QuoteStatus {
  Published = 'Published',
  Unpublished = 'Unpublished',
}

export type SignInUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignUpUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UpdateUserInput = {
  displayName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  displayName?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  password: Scalars['String']['output'];
  status: UserStatus;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges?: Maybe<Array<Maybe<UserEdge>>>;
  pageInfo?: Maybe<PageInfo>;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<User>;
};

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export type RandomQuoteQueryVariables = Exact<{ [key: string]: never }>;

export type RandomQuoteQuery = {
  __typename?: 'Query';
  randomQuote?: {
    __typename?: 'Quote';
    _id: string;
    author: string;
    content: string;
    likeCount: number;
    likedUsers: Array<{ __typename?: 'User'; displayName?: string | null; avatar?: string | null }>;
  } | null;
};

export const RandomQuoteDocument = gql`
  query RandomQuote {
    randomQuote {
      _id
      author
      content
      likeCount
      likedUsers {
        displayName
        avatar
      }
    }
  }
`;

/**
 * __useRandomQuoteQuery__
 *
 * To run a query within a React component, call `useRandomQuoteQuery` and pass it any options that fit your needs.
 * When your component renders, `useRandomQuoteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRandomQuoteQuery({
 *   variables: {
 *   },
 * });
 */
export function useRandomQuoteQuery(
  baseOptions?: Apollo.QueryHookOptions<RandomQuoteQuery, RandomQuoteQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<RandomQuoteQuery, RandomQuoteQueryVariables>(RandomQuoteDocument, options);
}
export function useRandomQuoteLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RandomQuoteQuery, RandomQuoteQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<RandomQuoteQuery, RandomQuoteQueryVariables>(RandomQuoteDocument, options);
}
export function useRandomQuoteSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RandomQuoteQuery, RandomQuoteQueryVariables>,
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<RandomQuoteQuery, RandomQuoteQueryVariables>(RandomQuoteDocument, options);
}
export type RandomQuoteQueryHookResult = ReturnType<typeof useRandomQuoteQuery>;
export type RandomQuoteLazyQueryHookResult = ReturnType<typeof useRandomQuoteLazyQuery>;
export type RandomQuoteSuspenseQueryHookResult = ReturnType<typeof useRandomQuoteSuspenseQuery>;
export type RandomQuoteQueryResult = Apollo.QueryResult<RandomQuoteQuery, RandomQuoteQueryVariables>;
