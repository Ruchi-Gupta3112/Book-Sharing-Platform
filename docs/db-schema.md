# Database Schema Documentation

## Database

The project connects to the following MongoDB database during local development:

```text
bookshare
```

## Collections Overview

The backend uses three primary collections:

- `users`
- `books`
- `borrowrequests`

## 1. User Collection

Defined in `backend/models/User.js`.

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | String | Yes | Trimmed before storage |
| `email` | String | Yes | Unique, trimmed, used for login |
| `password` | String | Yes | Stored as hashed value |
| `role` | String | No | Defaults to `user` |
| `createdAt` | Date | Auto | Added by timestamps |
| `updatedAt` | Date | Auto | Added by timestamps |

## 2. Book Collection

Defined in `backend/models/Book.js`.

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | String | Yes | Trimmed, used to merge same-title entries into one inventory record |
| `author` | String | Yes | Trimmed |
| `genre` | String | No | Defaults to `General` |
| `description` | String | No | Defaults to empty string |
| `ownerId` | ObjectId | No | Reference to `User` |
| `ownerName` | String | No | Defaults to `Community Member` |
| `language` | String | No | Defaults to `English` |
| `totalCopies` | Number | No | Total number of copies held for this title |
| `availableCopies` | Number | No | Number of copies currently available to borrow |
| `pageCount` | Number | No | Defaults to `0` |
| `publishedYear` | Number | No | Optional |
| `coverImage` | String | No | Optional image URL/path |
| `readUrl` | String | No | Optional external reading link |
| `readContent` | String | No | Inline reading content shown in profile |
| `isBorrowed` | Boolean | No | Defaults to `false` |
| `available` | Boolean | No | Defaults to `true` |
| `createdAt` | Date | Auto | Added by timestamps |
| `updatedAt` | Date | Auto | Added by timestamps |

## 3. BorrowRequest Collection

Defined in `backend/models/BorrowRequest.js`.

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `bookId` | ObjectId | Yes | Reference to `Book` |
| `borrowerId` | ObjectId | Yes | Reference to `User` |
| `status` | String | No | `pending`, `approved`, or `returned` |
| `borrowDate` | Date | No | Defaults to current time |
| `returnDate` | Date | No | User-selected return date |
| `dueDate` | Date | No | Mirrors `returnDate` when provided |
| `returnedAt` | Date | No | Set when a book is returned |
| `createdAt` | Date | Auto | Added by timestamps |
| `updatedAt` | Date | Auto | Added by timestamps |

## Relationships

### `Book.ownerId -> User._id`
Allows a book to be associated with a user owner if needed.

### `BorrowRequest.bookId -> Book._id`
Links a borrow record to the borrowed book.

### `BorrowRequest.borrowerId -> User._id`
Links a borrow record to the user who borrowed the book.

## Relationship Diagram

```text
User
 |-- owns --> Book
 `-- borrows --> BorrowRequest --> Book
```

## Business Rules Reflected in the Schema

- one title can have multiple copies
- borrowing one copy decreases `availableCopies` by `1`
- returning one copy increases `availableCopies` by `1`
- a title is fully unavailable only when `availableCopies = 0`
- `isBorrowed` and `available` are synchronized from copy counts for UI convenience
- borrowed-book history is stored in `BorrowRequest`
- profile statistics are computed from borrow records rather than stored separately

## Notes

- same-title inventory merging is handled in route logic, not by a unique MongoDB index on `title`
- authorization rules are not enforced at the schema level
- the database schema is intentionally simple for local project/demo use
