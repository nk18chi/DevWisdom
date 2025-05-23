const usersTypeDef = `#graphql
type UserConnection @cacheControl(maxAge: 60) {
  edges: [UserEdge]
  pageInfo: PageInfo
}

type UserEdge {
  node: User
  cursor: String
}

type Query {
  users(first: Int!, after: String): UserConnection
}
`;

export default usersTypeDef;
