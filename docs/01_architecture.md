# DevWisdom Architecture Documentation

## Overview

DevWisdom is a sophisticated quotes management platform built as a monorepo using modern technologies and architectural patterns. **The application is architected around Domain-Driven Design (DDD) principles combined with functional domain modeling using TypeScript and the neverthrow library for robust error handling.** This approach emphasizes type safety, immutability, functional programming paradigms, and clean separation of concerns through explicit domain modeling.

## Project Structure

### Monorepo Organization

```
DevWisdom/
├── apps/
│   ├── backend/          # Node.js GraphQL API
│   └── frontend/         # Next.js 14 application
├── packages/             # Shared packages and utilities
├── docs/                # Documentation
└── configuration files  # Turborepo, pnpm, ESLint configs
```

### Technology Stack

**Build System:**
- Turborepo for build orchestration
- pnpm workspaces for dependency management
- TypeScript for type safety

**Backend:**
- Node.js with Express
- Apollo Server for GraphQL
- MongoDB with Mongoose
- JWT authentication

**Frontend:**
- Next.js 14 with App Router
- React 18 with Server Components
- Apollo Client for GraphQL
- Tailwind CSS for styling

## Backend Architecture

### Domain-Driven Design with Functional Modeling

The backend implements **Domain-Driven Design (DDD) through functional domain modeling in TypeScript**, creating a highly expressive and type-safe domain layer:

#### Domain Layer (`/src/domain/`)

**Entities:**
- `User.entity.ts` - Core user business object with authentication and profile
- `Quote.entity.ts` - Quote content and metadata management  
- `QuoteLike.entity.ts` - User quote interaction tracking
- `QuoteReport.entity.ts` - Content moderation and reporting system
- `Comment.entity.ts` - Comment system for quotes
- `Tag.entity.ts` - Tag categorization system

**Value Objects (Functional Domain Objects):**
- `Email.object.ts` - Type-safe email validation with Zod and neverthrow
- `MongoId.object.ts` - MongoDB ObjectId wrapper with newtype-ts
- `HashingPassword.object.ts` - Secure password handling with functional validation
- `RawPassword.object.ts` - Password input validation with strength requirements
- `QuoteContent.object.ts` - Quote content validation with Result types
- `QuoteAuthor.object.ts` - Quote attribution validation and formatting
- `DisplayName.object.ts` - User display name handling with type safety
- `TagLabel.object.ts` - Tag name validation and normalization
- `CommentContent.object.ts` - Comment text validation and sanitization
- `QuoteReportComment.object.ts` - Report reason validation

Each value object implements the functional domain modeling pattern:
```typescript
// Example: Email value object with neverthrow
export function Email(email: string): Result<Email, ValidationError> {
  const result = EmailSchema.safeParse(email);
  if (!result.success) {
    return err(fromZodError(result.error, { prefix: null }));
  }
  return ok(iso<Email>().wrap(email));
}
```

#### Application Layer (`/src/workflows/`)

**Functional business logic implemented as composable workflows using neverthrow:**

- `signUp.workflows.ts` - User registration with email verification pipeline
- `signIn.workflows.ts` - Authentication workflow with email verification checks
- `updateUser.workflows.ts` - User profile management with type-safe validation
- `forgotPassword.workflows.ts` - Password reset workflow with JWT-based secure links
- `emailVerification.workflows.ts` - Email verification process management
- `randomQuote.workflows.ts` - Quote retrieval logic for reviewed content
- `quoteModeration.workflows.ts` - Admin quote review and approval processes
- `reportManagement.workflows.ts` - Content reporting and moderation workflows

**Workflow Pattern Example:**
```typescript
// Functional workflow composition with explicit error handling
export const signUpWorkflow = (model: SignUpModel): ResultAsync<CreatedUser, ValidationError | DatabaseError> =>
  okAsync(model)
    .andThen(validatedUser)           // Result<ValidatedUser, ValidationError>
    .andThen(hashUserPassword)        // Result<UserWithHashedPassword, HashingError>
    .andThen(saveCreatedUser);        // ResultAsync<CreatedUser, DatabaseError>
```

#### Infrastructure Layer (`/src/infrastructure/`)

**Functional Repository Pattern with neverthrow:**
- `User.repository.ts` - User data access with `ResultAsync<T, E>` types
- `Quote.repository.ts` - Quote persistence layer with functional error handling
- `Comment.repository.ts` - Comment CRUD operations with Result types
- `Tag.repository.ts` - Tag management and quote association
- `QuoteReport.repository.ts` - Report tracking and moderation support
- `CommentReport.repository.ts` - Comment report management

**Repository Example:**
```typescript
// Repository functions return ResultAsync for composable error handling
export const saveCreatedUser = (model: CreatedUser): ResultAsync<User, DatabaseError> =>
  ResultAsync.fromPromise(
    UserModel.create(model),
    (error) => new DatabaseError('Failed to create user', error)
  );
```

**Database:**
- MongoDB connection management
- Mongoose schemas for data modeling
- Seed data for development

### Functional Domain Modeling with TypeScript

The backend implements **functional domain modeling** as a core architectural principle, leveraging TypeScript's type system and functional programming libraries:

#### neverthrow for Railway-Oriented Programming
- **`Result<T, E>`**: Explicit error handling without exceptions
- **`ResultAsync<T, E>`**: Asynchronous operations with built-in error handling
- **Railway-oriented programming**: Composable error handling pipelines
- **Type-safe error propagation**: Compile-time guarantees for error handling

#### Domain Object Libraries
- **newtype-ts:** Type-safe wrappers for primitive values (branded types)
- **fp-ts:** Functional programming utilities and algebraic data types
- **io-ts:** Runtime type validation that matches compile-time types

#### Functional Domain Patterns
```typescript
// Example: Functional workflow composition with neverthrow
const signUpWorkflow = (model: SignUpModel): ResultAsync<User, ValidationError | DatabaseError> =>
  okAsync(model)
    .andThen(validateSignUpModel)
    .andThen(hashPassword)
    .andThen(createUser)
    .andThen(saveUser);
```

This approach ensures **total functions**, **explicit error handling**, and **immutable domain objects** throughout the application.

### GraphQL Architecture

#### Schema Organization

- **Modular Schema:** Auto-discovery of `.schema.ts` files
- **Resolver Auto-loading:** Dynamic resolver registration
- **Type Generation:** GraphQL Code Generator for type safety

#### Security and Authorization

- **GraphQL Shield:** Rule-based authorization
- **JWT Authentication:** Stateless authentication
- **Field-level Security:** Password fields never exposed
- **Rate Limiting:** Query complexity protection

#### Performance Features

- **DataLoader:** Efficient data fetching with caching
- **Apollo Server Cache:** Built-in caching mechanisms
- **Query Complexity Analysis:** Prevention of expensive queries

### Functional Error Handling and Monitoring

- **neverthrow Result Types:** Complete elimination of runtime exceptions through functional error handling
- **Explicit Error Types:** All possible errors declared at the type level (ValidationError, DatabaseError, AuthenticationError, etc.)
- **Railway-Oriented Programming:** Error handling pipelines that automatically short-circuit on failures
- **Sentry Integration:** Error tracking and performance monitoring
- **Winston Logging:** Structured logging with different levels

**Error Handling Philosophy:**
```typescript
// No try-catch blocks needed - errors are values
const result: Result<User, ValidationError | DatabaseError> = await signUpWorkflow(data);

result.match(
  (user) => res.json({ success: true, user }),
  (error) => res.status(400).json({ success: false, error: error.message })
);
```

## Frontend Architecture

### Next.js 14 with App Router

**Component Strategy:**
- Server Components for data fetching and initial rendering
- Client Components for interactivity and state management
- File-based routing with nested layouts

### Apollo Client Integration

**GraphQL Client Setup:**
- `@apollo/experimental-nextjs-app-support` for Next.js integration
- Server-side rendering with Apollo queries
- Normalized cache with type policies
- Persisted queries with SHA-256 hashing

### State Management

**Apollo Cache as Primary State:**
- Normalized GraphQL cache
- Optimistic updates for better UX
- Relay-style pagination support

### UI Architecture

**Component System:**
- Shared UI package (`@workspace/ui`)
- Radix UI primitives for accessibility
- Tailwind CSS utility-first styling
- Shadcn/ui component system

## Data Models and Business Logic

### Core Entities

#### User Entity
```typescript
interface User {
  _id: MongoId
  email: Email                    // @unique @immutable with Zod validation
  password: HashingPassword       // @hash - Never exposed in GraphQL
  emailVerified: boolean          // @default:false
  status: UserStatus              // @enum:["Active", "Inactive"] @default:Active
  
  // Profile Information
  displayName?: DisplayName       // Optional user display name
  image?: string                  // Optional avatar/profile image
}
```

#### Quote Entity
```typescript
interface Quote {
  _id: MongoId
  content: QuoteContent          // Quote text content
  author: QuoteAuthor           // Quote attribution
  status: QuoteStatus           // @enum:["Published", "Unpublished"] @default:Published
  isReviewed: boolean           // @default:false - Admin review status
  userId: MongoId               // @ref:User - Quote creator
  
  // Relationships
  tagIds: MongoId[]             // @ref:Tag - Associated tags
  commentIds: MongoId[]         // @ref:Comment - Quote comments
  likes: MongoId[]              // @ref:User - Users who liked
  favorites: MongoId[]          // @ref:User - Users who favorited
  reports: QuoteReport[]        // Content moderation reports
}
```

#### Comment Entity
```typescript
interface Comment {
  _id: MongoId
  content: string               // Comment text
  userId: MongoId               // @ref:User - Comment author
  quoteId: MongoId             // @ref:Quote - Associated quote
  status: CommentStatus         // @enum:["Published", "Unpublished"] @default:Published
  likes: MongoId[]             // @ref:User - Users who liked comment
  reports: CommentReport[]      // Content moderation reports
}
```

#### Tag Entity
```typescript
interface Tag {
  _id: MongoId
  label: string                 // Tag display name
  quoteIds: MongoId[]          // @ref:Quote - Associated quotes
}
```

#### Report Entities
```typescript
interface QuoteReport {
  comment: string               // Report reason/description
  userId: MongoId              // @ref:User - Reporting user
  status: ReportStatus         // @enum:["Unreviewed", "Declined", "Resolved"]
  createdAt: Date
}

interface CommentReport {
  comment: string               // Report reason/description  
  userId: MongoId              // @ref:User - Reporting user
  status: ReportStatus         // @enum:["Unreviewed", "Declined", "Resolved"]
  createdAt: Date
}
```

### Authorization Model

```typescript
// GraphQL Shield permissions
const permissions = shield({
  Query: {
    '*': isAuthenticated,
    signIn: allow,
    quote: allow,
    quotes: allow,
    randomQuote: allow,
  },
  Mutation: {
    '*': isAuthenticated,
    signUp: allow,
  },
  User: {
    password: deny, // Security: Never expose passwords
  }
})
```

## Data Flow Architecture

### Backend Data Flow

1. **GraphQL Request** → **Apollo Server** → **GraphQL Shield** (Authorization)
2. **Resolver** → **Workflow** → **Repository** → **MongoDB**
3. **Domain Objects** → **Value Object Validation** → **Response**

### Frontend Data Flow

1. **GraphQL Schema** → **Code Generation** → **TypeScript Types**
2. **Server Component** → **Apollo Query** → **Server-side Rendering**
3. **Client Component** → **Apollo Hooks** → **Client-side Updates**

## Security Architecture

### Authentication and User Management Flows

#### User Registration Flow
1. User provides email and password via `signUp` mutation
2. Password validation and encryption using functional domain objects
3. User account created with `emailVerified: false` status
4. Email verification link sent (JWT-based, expires in 15 minutes)
5. User cannot sign in until email is verified
6. Upon email verification, `emailVerified` is set to `true`

#### Sign In Flow
1. User provides credentials via `signIn` mutation
2. Workflow validates email exists and password matches
3. Check `emailVerified` status and `status: Active`
4. If email not verified, resend verification email
5. If verified and active, generate JWT token
6. Token included in subsequent requests for authorization

#### Forgot Password Flow
1. User provides email via `forgotPassword` mutation
2. JWT-based reset link generated (expires in 15 minutes)
3. No error shown if email doesn't exist (security measure)
4. User clicks reset link and provides new password
5. Password updated using functional validation
6. User redirected to login page

#### Profile Management
1. Authenticated users can update `displayName` and `image`
2. Password updates require re-encryption
3. Email addresses cannot be changed (immutable)
4. Admin users can change user `status` to `Active`/`Inactive`

### Content Management and Moderation Flows

#### Quote Management
1. **Quote Creation:** Users create quotes with content and author attribution
2. **Default Status:** New quotes are `Published` by default and immediately searchable
3. **Admin Review:** All quotes start with `isReviewed: false`
4. **Review Process:** Admins can mark quotes as reviewed for random quote display
5. **Quote Updates:** Editing published quotes resets `isReviewed` to `false`
6. **Quote Deletion:** Removes quote and all associated comments, likes, reports

#### Comment System
1. **Authenticated Commenting:** Users can comment on quotes when logged in
2. **Comment Likes:** Users can like any comments, including their own
3. **Comment Management:** Users can delete their own comments
4. **Anonymous Prompts:** Non-logged users see login/signup prompts for commenting

#### Reporting and Moderation
1. **Content Reporting:** Users can report quotes and comments with reasons
2. **Report Statuses:** `Unreviewed` → `Declined` or `Resolved` by admins
3. **Admin Actions:** Admins can unpublish quotes/comments or resolve reports
4. **User Privacy:** Users cannot see their own reported content in profiles

#### Tag and Discovery System
1. **Tag-based Organization:** Quotes organized by tags for discovery
2. **Tag Search:** Users can view all quotes associated with specific tags
3. **Random Quote Display:** Only reviewed quotes appear in random displays
4. **Profile Views:** Users can view their quotes, likes, favorites, and comments

### Authorization Strategy

- **Field-level Authorization:** Password fields never exposed, sensitive data protected
- **Operation-level Authorization:** Most mutations require authentication
- **Public Queries:** Quote viewing, search, and random quotes available publicly
- **Role-based Access:** Admin-only operations for moderation and user management
- **Rate Limiting:** Protection against abuse and spam

## Development and Quality Assurance

### Testing Strategy

**Backend Testing:**
- Unit tests with Vitest
- Integration tests for workflows
- Repository tests with mock database
- E2E tests for GraphQL endpoints

**Frontend Testing:**
- Component testing with React Testing Library
- Integration tests for Apollo Client
- Visual regression testing

### Code Quality Tools

- **TypeScript:** Strict type checking across the stack
- **ESLint:** Custom rules for code consistency
- **Prettier:** Automated code formatting
- **Husky:** Git hooks for quality gates

### Build and Deployment

- **Turborepo:** Parallel builds and caching
- **Environment Configuration:** Separate configs for development/production
- **Docker Support:** Containerized deployment
- **CI/CD:** Automated testing and deployment pipelines

## Performance Considerations

### Backend Performance

- **DataLoader:** Batched and cached database queries
- **GraphQL Caching:** Apollo Server cache control headers
- **Database Indexing:** Optimized MongoDB queries
- **Connection Pooling:** Efficient database connections

### Frontend Performance

- **Server Components:** Reduced client-side JavaScript
- **Code Splitting:** Dynamic imports for large components
- **Image Optimization:** Next.js built-in image optimization
- **Bundle Analysis:** Regular bundle size monitoring

## Monitoring and Observability

### Error Tracking

- **Sentry Integration:** Both frontend and backend error tracking
- **Structured Logging:** Winston logger with different levels
- **Error Boundaries:** React error boundaries for graceful failures

### Performance Monitoring

- **GraphQL Query Analysis:** Track slow queries
- **Database Performance:** MongoDB query profiling
- **Frontend Metrics:** Core Web Vitals tracking

## Scalability Considerations

### Horizontal Scaling

- **Stateless Architecture:** JWT-based authentication
- **Database Sharding:** MongoDB horizontal scaling options
- **CDN Integration:** Static asset distribution
- **Load Balancing:** Multiple backend instances

### Vertical Scaling

- **Database Optimization:** Query optimization and indexing
- **Caching Strategies:** Multiple cache layers
- **Resource Monitoring:** CPU and memory usage tracking

## Future Architecture Considerations

### Microservices Migration

- **Service Boundaries:** Clear domain separation
- **API Gateway:** Centralized routing and authentication
- **Event-Driven Architecture:** Asynchronous communication

### Advanced Features

- **Real-time Updates:** GraphQL subscriptions for live comments and likes
- **Advanced Search:** Full-text search with tag filtering and author search
- **Recommendation System:** ML-based quote recommendations based on user preferences
- **Content Moderation:** Automated content filtering and spam detection
- **Email System:** Verification emails, password reset, and notification system
- **Admin Dashboard:** Content moderation interface and user management
- **Analytics:** Quote engagement tracking and user behavior insights

---

*This documentation reflects the current state of the DevWisdom architecture and should be updated as the system evolves.*