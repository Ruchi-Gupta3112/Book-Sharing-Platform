# Architecture Documentation

## Project Overview

Book Sharing Platform is a full-stack web application that supports the full borrowing cycle for community-shared books: account creation, login, catalog browsing, borrowing, in-app reading, and returning.

## Architecture Style

The application follows a standard client-server architecture:

1. the React frontend handles page rendering and user interactions
2. the frontend sends HTTP requests to the Express backend using Axios
3. the backend applies validation and business rules
4. Mongoose models persist data in MongoDB
5. JSON responses are returned to the frontend and rendered in the UI

## Technology Stack

### Frontend
- React
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express
- Mongoose
- bcrypt
- jsonwebtoken
- cors

### Database
- MongoDB

## Runtime Structure

### Frontend application
The frontend is responsible for:

- login and registration screens
- guarded routing based on token presence
- dashboard book listing, search, and filtering
- borrow action submission
- admin-side book creation form
- profile reading modal and return action
- help and onboarding content

### Backend application
The backend is responsible for:

- connecting to MongoDB
- exposing REST endpoints under `/api`
- validating request data
- hashing passwords
- generating JWT tokens for login
- managing book availability and borrow records

## Core Modules

### Authentication module
- implemented in `backend/routes/userRoutes.js`
- handles registration and login
- stores passwords in hashed form
- returns token plus user metadata on login

### Catalog module
- implemented mainly through `backend/routes/bookRoutes.js`
- lists all books
- supports inventory-aware titles using `totalCopies` and `availableCopies`
- when the same title is added again, the system increases its copy count instead of creating a duplicate row

### Borrowing module
- implemented in `backend/routes/borrowRoutes.js`
- creates borrow records
- checks return date validity
- decreases `availableCopies` when a user borrows one copy
- increases `availableCopies` when a borrowed copy is returned
- only marks a title unavailable when no copies remain

### Profile module
- supported by `backend/routes/userRoutes.js` and `frontend/src/pages/UserProfile.js`
- fetches profile summary and current borrowed books
- calculates active borrow, readable, and overdue counts

### Help module
- implemented in `frontend/src/pages/Help.js`
- provides onboarding and feature guidance for end users

## Request Flow Example

### Borrow flow
1. the user logs in from the frontend
2. the dashboard fetches books from `GET /api/books`
3. the user selects a return date and clicks borrow
4. the frontend sends `POST /api/borrow/:bookId`
5. the backend validates the request and creates a borrow record
6. the book inventory is reduced by one available copy
7. if no copies remain, the title is marked unavailable
8. the frontend refreshes the list

### Return flow
1. the user opens the profile page
2. the frontend fetches profile data from `GET /api/users/:userId/profile`
3. the user clicks return
4. the frontend sends `POST /api/borrow/:requestId/return`
5. the backend marks the record returned and adds one copy back to available inventory
6. the frontend reloads the profile state

## Data Ownership

### Frontend state
- session token and user details are stored in local storage
- page components manage their own UI state with React hooks
- dashboard stores current search, filter, loading state, and borrow-date inputs
- profile stores selected reading item and summary stats

### Backend state
- persistent data is stored in MongoDB collections
- book availability is derived from `availableCopies` and synchronized with borrow actions

## Current Design Decisions

- the app uses local storage for session persistence instead of server-side sessions
- the backend exposes simple REST endpoints rather than GraphQL or RPC-style APIs
- same-title additions are merged into a single catalog entry with inventory counts
- reading content can be stored directly on the book document to keep the demo flow simple
- route guarding in the frontend is based on token presence, not token verification

## Constraints and Tradeoffs

- the JWT secret and MongoDB connection string are currently hard-coded
- authorization middleware is not yet enforced on protected backend routes
- the admin panel is available in the UI, but role-based backend restriction is not implemented yet
- inventory is tracked per title rather than as separate physical copy records

