# API Documentation

## Base URL

```text
http://localhost:5000/api
```

## Overview

The backend exposes three route groups:

- `users` for registration, login, borrowed books, and profile data
- `books` for listing and creating books
- `borrow` for borrowing and returning books

The API returns JSON responses and uses MongoDB through Mongoose models.

## User Endpoints

### `POST /api/users/register`
Creates a new user account.

#### Request body
```json
{
  "name": "Rahul Gupta",
  "email": "rahul@example.com",
  "password": "mypassword123"
}
```

#### Validation
- `name` is required by the user model
- `email` must be present and match a valid email pattern
- email is normalized to lowercase and trimmed
- duplicate email addresses are rejected
- `password` is hashed with bcrypt before storage

#### Success response
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "6635b8c1234567890abcd111",
    "name": "Rahul Gupta",
    "email": "rahul@example.com",
    "role": "user"
  }
}
```

### `POST /api/users/login`
Authenticates a user and returns a JWT token plus user details.

#### Request body
```json
{
  "email": "rahul@example.com",
  "password": "mypassword123"
}
```

#### Behavior
- email is normalized to lowercase and trimmed
- the user is searched by normalized email
- password is checked with bcrypt
- a token is created with user id, email, and role

#### Success response
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "6635b8c1234567890abcd111",
    "name": "Rahul Gupta",
    "email": "rahul@example.com",
    "role": "user"
  }
}
```

### `GET /api/users/:userId/borrowed`
Returns the currently borrowed books for a user, excluding returned records.

#### Response notes
- results are sorted by latest borrow date first
- `bookId` is populated with book details

### `GET /api/users/:userId/profile`
Returns a richer profile payload for the given user.

#### Response shape
```json
{
  "user": {
    "name": "Rahul Gupta",
    "email": "rahul@example.com",
    "role": "user",
    "createdAt": "2026-05-07T12:00:00.000Z"
  },
  "borrowedBooks": [],
  "stats": {
    "activeBorrows": 0,
    "currentlyReading": 0,
    "overdue": 0
  }
}
```

## Book Endpoints

### `GET /api/books`
Returns all books sorted by newest first.

Each returned book now includes inventory fields such as:
- `totalCopies`
- `availableCopies`
- `available`
- `isBorrowed`

### `POST /api/books`
Adds a new book to the shared library or increases the copy count of an existing title.

#### Example request body
```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "genre": "Self Help",
  "description": "A practical guide to building better habits.",
  "ownerName": "Community Shelf",
  "language": "English",
  "copyCount": 3,
  "pageCount": 320,
  "publishedYear": 2018,
  "readUrl": "",
  "readContent": "Sample chapter text"
}
```

#### Validation
- `title` is required
- the title is trimmed before saving
- `copyCount` defaults to `1` when not provided
- if the same title already exists, the backend increases `totalCopies` and `availableCopies` instead of creating a separate duplicate record

## Borrow Endpoints

### `POST /api/borrow/:bookId`
Borrows an available book for a user.

#### Request body
```json
{
  "userId": "6635b8c1234567890abcd111",
  "returnDate": "2026-05-10"
}
```

#### Validation and behavior
- `userId` is required
- the book must exist
- the book must have at least one available copy
- if a return date is provided, it must be a valid date
- the return date cannot be earlier than the borrowing date
- borrowing decreases `availableCopies` by `1`
- the book becomes fully unavailable only when `availableCopies` reaches `0`
- a `BorrowRequest` document is created with status `approved`

#### Success response
```json
{
  "message": "Book borrowed successfully!",
  "borrowRequest": {
    "_id": "6635b8c1234567890abcd222",
    "status": "approved"
  }
}
```

### `POST /api/borrow/:requestId/return`
Returns a previously borrowed book.

#### Behavior
- the borrow request must exist
- a returned request cannot be returned again
- the borrow record is marked as `returned`
- `returnedAt` is stored
- the related book gains one available copy again, up to `totalCopies`

## Common Error Messages

```json
{ "message": "Please enter a valid email address" }
```

```json
{ "message": "User already exists" }
```

```json
{ "message": "Invalid credentials" }
```

```json
{ "message": "No copies are currently available" }
```

```json
{ "message": "Return date cannot be earlier than the borrowing date" }
```

## Implementation Notes

- the backend currently uses a hard-coded JWT secret
- the MongoDB connection string is currently hard-coded in `backend/server.js`
- authentication tokens are generated on login, but route-level authorization middleware is not yet implemented
- inventory updates are handled at the application layer rather than through a separate stock ledger
