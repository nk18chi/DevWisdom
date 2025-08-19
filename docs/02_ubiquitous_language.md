# Ubiquitous Language

This document establishes a shared language for the application to ensure clarity and consistency among team members, particularly in defining data structures, workflows, and interactions.

## Data Structure

### User

- email: @string @unique @immutable
  use email validation from zod
- emailVerified: @boolean @default:false
- password: @string @hash
  cannot be decrypted using crypto
  check if password is strong enough by "validator"
- status: @enum:["Active", "Inactive"] @default:Active
  active by default. Admin can change the status of a user to "Inactive" for bad actors
  inactive users cannot log in

### Profile

- displayName: @string
- image: @string

### Quote

- content: @string
- author: @string
- tagIds: @ref:tag
- commentIds: @ref:comment
- likes: @ref:userId
- favorites: @ref:userId
  You can see the all quotes you added in favorite in profile page. You cannot see all likes quotes
- reports: {
  comment: @string
  userId: @ref:userId
  status: @enum["Unreviewed", "Declined", "Resolved"]
  }[]
- userId: @ref:userId
- status: @enum:["Published", "Unpublished"] @default:Published
  only admin can change the status to "unpublished"
- isReviewed: @boolean @default:false
  Once admin user reviews it, it becomes true

### Tag

- label: @string

## Comments

- content: @string
- userId: @ref:userId
- status: @enum:["Published", "Unpublished"] @default:Published
  only admin can change the status to "unpublished"
- likes: @ref:userId
- reports: {
  comment: @string
  userId: @ref:userId
  status: @enum["Unreviewed", "Declined", "Resolved"]
  }[]

## WorkFlow

### User Registration

1. Users provide an email and password on the sign-up page
   1.1. Passwords should be encrypted before being saved in the database
2. A user account is created in the database, and an email verification link is sent
   2.1. Users cannot log in unless their email is verified
   2.2. If a user attempts to log in before verifying their email, the verification email is resent to them
3. Once the user clicks the verification link in the email, emailVerified is set to true
4. The user can log in and is directed to the top page
5. The user can access their account page to update their password, display name, and image
   5.1. Updated passwords should also be encrypted before saving to the database
6. Users cannot change their email address at this time

### Forgot Password

1. Users provide their email address to receive a password reset link
   1.1. The link is JWT hashed using the user's ID and expires after 15 minutes
   1.2. For security reasons, no error message is shown if the email does not exist in the database to avoid revealing account existence
2. After clicking the reset link, users can set a new password that must meet the same validation criteria as during sign-up
3. The password is updated, and the user is redirected to the login page

### View Quotes

1. A random quote is displayed on the top page, along with options to like, favorite, or report it, and a link to its detail page
   1.1 If a non-logged-in user clicks like, favorite, or report, they are redirected to the login page
2. A tag list is displayed below the randomized quote section
3. Clicking a tag shows a search result page with all quotes associated with that tag
4. Users can view a quote's detail page by clicking on it, where they can also view or add comments
5. Users can post comments on the detail page
   5.1 If the user is not logged in, a message informs them that commenting requires login, and links to log in or sign up are displayed
6. Logged-in users can like quotes and comments, including their own comments
   6.1 Users can delete their comments
7. Logged-in users can report quotes or comments and provide a reason for reporting
   7.1 Admins can review reported comments and mark them as "Declined" or "Resolved"
8. Users can view their quotes, liked/favorited quotes, and added comments on their profile page, but they cannot view their reported comments

### Manage your own Quotes

1. Users can provide quote details, such as content and author, to create a new quote
   1.1 Newly created quotes are public by default and searchable in the search results and detail pages
   1.2 Admins can review all unreviewed quotes and mark them as reviewed
   1.3 Once a quote is reviewed, it can appear as a randomized quote on the top page
2. User can see the posted quotes from their account page
3. User can update their quote
   3.1 Updating a published quote resets isReviewed to false
4. User can delete their quote and all related comment/likes/reports are removed
