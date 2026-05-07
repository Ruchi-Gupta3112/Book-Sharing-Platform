# Book Sharing Platform

A full-stack web application for sharing, borrowing, reading, and returning books within a small community. The project includes a React frontend, an Express backend, and MongoDB persistence for users, books, and borrowing activity.

## What the App Does

- lets new users register and existing users log in
- shows a searchable shared library of books
- allows a user to borrow a book with a selected return date
- tracks borrowed books inside the user profile
- lets the borrower read in-app content or open an external reading link
- allows books to be returned so they become available again
- includes an admin-style page for adding books and reading content
- includes a help page for first-time users

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Custom CSS

### Backend
- Node.js
- Express
- Mongoose
- bcrypt
- JSON Web Token

### Database
- MongoDB

## Project Structure

```text
book-sharing-platform/
|-- backend/
|   |-- models/
|   |-- routes/
|   `-- server.js
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   `-- pages/
|   `-- package.json
|-- docs/
`-- README.md
```

## Main User Flows

### 1. Authentication
Users can create an account from the landing screen or log in with an existing account. Successful login stores the token, user object, and user id in local storage so the UI can keep the session active.

### 2. Browse and Borrow
The dashboard fetches all books from the backend, supports search and genre filtering, and allows borrowing an available title after selecting a return date.

### 3. Read in Profile
Borrowed books appear in the user profile. From there, the user can open the reading modal, read the stored content, follow an external reading link if present, or return the book.

### 4. Add Books
The admin panel allows new books to be added with richer metadata such as description, owner name, language, page count, published year, reading link, and in-app reading content.

## Prerequisites

Before starting the project, make sure the following are available on your machine:

- Node.js and npm
- MongoDB running locally
- a browser for the React development server

## Local Setup

Install dependencies separately for backend and frontend if they are not already installed.

### Backend install
```bash
cd backend
npm install
```

### Frontend install
```bash
cd frontend
npm install
```

## Running the Application

### Start the backend
The backend server is started directly with Node:

```bash
cd backend
node server.js
```

The backend listens on `http://localhost:5000` and connects to the local MongoDB database:

```text
mongodb://localhost:27017/bookshare
```

### Start the frontend
The frontend runs with the React development server:

```bash
cd frontend
npm start
```

The UI opens on `http://localhost:3000` and communicates with the backend at `http://localhost:5000/api`.

## API Summary

### User routes
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/:userId/borrowed`
- `GET /api/users/:userId/profile`

### Book routes
- `GET /api/books`
- `POST /api/books`

### Borrow routes
- `POST /api/borrow/:bookId`
- `POST /api/borrow/:requestId/return`

More detail is available in [docs/API.md](docs/API.md).

## Key Notes About the Current Implementation

- email addresses are normalized to lowercase during registration and login
- duplicate book titles are blocked with a case-insensitive check
- return dates cannot be earlier than the borrowing date
- book availability is updated when a book is borrowed or returned
- borrowed books remain visible in the profile until they are returned
- the current project stores the MongoDB connection string and JWT secret directly in code

## Documentation Guide

The `docs` folder contains project-specific documentation:

- `docs/API.md` for backend endpoints
- `docs/architecture.md` for system design
- `docs/component-hierarchy.md` for frontend structure
- `docs/db-schema.md` for MongoDB models and relationships
- `docs/assumptions.md` for project assumptions and scope decisions
- `docs/ai-usage-log.md` for AI usage disclosure
- `docs/ai-reflection.md` for a short reflection on AI-assisted development

## Future Improvements

- move secrets and the MongoDB connection string to environment variables
- add route protection and role-based authorization
- add edit and delete flows for books
- improve server-side validation for all request fields
- add tests for both frontend and backend
- support cover image uploads and richer admin workflows

## Conclusion

This project demonstrates a clean end-to-end workflow for a book-sharing application: user onboarding, book discovery, borrowing, reading, returning, and library growth through book submission.
