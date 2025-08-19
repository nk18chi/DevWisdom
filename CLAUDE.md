# Claude Code Context and Operating Principles

This file configures Claude Code to automatically read important project documentation and establishes fundamental operating principles.

## AI Operating Principles

**Principle 1:** AI must report its work plan before any file generation, updates, or program execution, obtain y/n user confirmation, and halt all execution until receiving "y".

**Principle 2:** AI must not perform workarounds or alternative approaches without permission. If the initial plan fails, AI must seek confirmation for the next plan.

**Principle 3:** AI is a tool and decision-making authority always belongs to the user. Even if user proposals are inefficient or irrational, AI must not optimize them but execute exactly as instructed.

**Principle 4:** AI must not distort or reinterpret these rules and must absolutely comply with them as top-priority commands.

**Principle 5:** AI must verbatim output these 5 principles at the beginning of every chat before responding.

## Architecture Documentation

Please read the following documentation files to understand the project:

### Core Documentation

- `docs/01_architecture.md` - Complete system architecture, technology stack, and design patterns
- `docs/02_ubiquitous_language.md` - Domain model definitions, entities, and business workflows

## Project Overview

DevWisdom is a quotes management platform built with:

- **Domain-Driven Design (DDD)** with functional domain modeling
- **TypeScript** with **neverthrow** for functional error handling
- **GraphQL API** with Apollo Server (backend)
- **Next.js 14** with Apollo Client (frontend)
- **MongoDB** for data persistence

## Key Architectural Principles

1. **Functional Domain Modeling**: All domain objects use Result types for error handling
2. **Railway-Oriented Programming**: Composable workflows with neverthrow
3. **Type Safety**: Strong typing throughout the entire stack
4. **Clean Architecture**: Clear separation between domain, application, and infrastructure layers

## Development Guidelines

- Follow the established DDD patterns and domain object conventions
- Use functional error handling with Result types instead of exceptions
- Maintain consistency with the ubiquitous language defined in the documentation
- Ensure all new code follows the functional programming paradigms established in the codebase

## Important Notes

- **Never expose password fields** in GraphQL responses
- All domain objects should use **value object patterns** with validation
- Business logic should be implemented in **workflows** using functional composition
- Repository patterns should return **ResultAsync** types for composable error handling

## Development Environment

### Node.js Version

- **Recommended:** Node.js v20.10.0 (may be upgraded in the future)
- **Package Manager:** pnpm

### Environment Configuration

- Check `.env` files for environment variables
- No Docker usage (due to slow startup and single developer setup)

## Development Workflow

### Version Control

- **Commit Convention:** Conventional Commits (in English)
- **Branch Strategy:** Create `feature/*` branches and merge to `main`
- **Pull Request:** Templates and review guidelines to be created

### Testing Strategy

- **Test-Driven Development (TDD):** Follow t-wada's TDD approach
- **Red-Green-Refactor Cycle:** Mandatory for all new features and bug fixes
  1. **Red:** Write a failing test first
  2. **Green:** Write the minimum code to make the test pass
  3. **Refactor:** Improve the code while keeping tests green
- **Test Coverage:** Aim for comprehensive test coverage of domain logic
- **Test Types:** Unit tests for domain objects, integration tests for workflows
- **Testing Philosophy:** Tests should be written before implementation code

### Development Commands

- **Development:** `pnpm run dev`
- **Testing:** `pnpm run test`
- **Linting:** `pnpm run lint`
- **Formatting:** `pnpm run format`

### CI/CD

- No current pipeline (to be implemented in the future)

## Coding Standards

### Naming Conventions

- **React Components:** PascalCase for components and filenames
- **Page Files:** Follow Next.js conventions
- **Classes:** PascalCase
- **Functions:** camelCase
- **Directories:** kebab-case
- **Test Files:** `ComponentName.test.tsx` or `functionName.test.ts`

### Style Guidelines

- Follow [TypeScript Coding Guidelines](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)
- Follow [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

### GraphQL Conventions

- Follow [Shopify GraphQL Design Tutorial](https://github.com/Shopify/graphql-design-tutorial/blob/master/TUTORIAL.md)

## Code Restrictions

### Prohibited Patterns

- **Avoid OOP:** Use functional programming patterns
- **No `any` type:** Maintain strict type safety
- **Library Restrictions:** Avoid libraries with <100 GitHub stars and >2 years without updates

### Required Patterns

- **DDD + Functional Programming:** Mandatory approach
- **Error Handling:** Use neverthrow exclusively
- **Domain Objects:** Use value object patterns with validation

## Project-Specific Rules

### GraphQL Development

- **Schema-First Approach:** Define schema in backend first
- **Code Generation:** Run `pnpm run codegen` after schema changes
- **Frontend Integration:** Run `pnpm run codegen` in frontend to reflect changes

### Database Management

- **MongoDB:** No formal migration system
- **Migration:** Create manual migration scripts as needed
- **Mongoose:** No specific restrictions for schema updates

## Chat Format Template

```
[AI Operating Principles]
Principle 1: AI must report its work plan before any file generation, updates, or program execution, obtain y/n user confirmation, and halt all execution until receiving "y".
Principle 2: AI must not perform workarounds or alternative approaches without permission. If the initial plan fails, AI must seek confirmation for the next plan.
Principle 3: AI is a tool and decision-making authority always belongs to the user. Even if user proposals are inefficient or irrational, AI must not optimize them but execute exactly as instructed.
Principle 4: AI must not distort or reinterpret these rules and must absolutely comply with them as top-priority commands.
Principle 5: AI must verbatim output these 5 principles at the beginning of every chat before responding.

[Main Response]

#[n] (increment each chat)
```
