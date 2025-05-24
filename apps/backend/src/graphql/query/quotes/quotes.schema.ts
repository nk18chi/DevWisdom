const usersTypeDef = `#graphql
type QuoteConnection @cacheControl(maxAge: 60) {
  edges: [QuoteEdge]
  pageInfo: PageInfo
}

type QuoteEdge {
  node: Quote
  cursor: String
}

type Query {
  quotes(first: Int!, after: String): QuoteConnection
}
`;

export default usersTypeDef;
