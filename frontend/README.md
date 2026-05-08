# Frontend Guide

This frontend is the React user interface for the Book Sharing Platform. It handles authentication screens, dashboard browsing, admin book entry, profile-based reading, and the help page.

## Start the Frontend

```bash
npm start
```

The development server runs on `http://localhost:3000`.

## Frontend Responsibilities

- render the login and registration experience
- keep session data in local storage
- fetch books and profile data from the backend API
- let users search and filter the catalog
- let users borrow books with a chosen return date
- let users read borrowed content from the profile screen
- let users return books
- let admins or catalog managers add new books

## Main Pages

### `LoginPage`
Handles both login and registration. On successful login it stores:

- `token`
- `user`
- `userId`

in local storage.

### `Dashboard`
Displays all books, search input, genre filter, and borrow controls.

### `AdminPanel`
Provides the form for adding books with metadata and reading content.

### `UserProfile`
Shows borrowed books, reading stats, the reader modal, and return actions.

### `Help`
Explains how to use the app step by step.

## Shared Components

### `Navbar`
Visible after login and provides navigation links and logout behavior.

### `BookCard`
A reusable card component included in the codebase. The dashboard currently renders its own card layout directly, so this component is available but not the primary book renderer right now.

## API Connection

The frontend is currently configured to call the backend at:

```text
http://localhost:5000/api
```

This base URL is defined directly inside the page components that make API requests.

## Routing Overview

The main routes are:

- `/` for login and registration
- `/dashboard` for catalog browsing
- `/admin` for adding books
- `/help` for usage guidance
- `/profile` for borrowed books and reading

If there is no token in local storage, protected pages redirect back to `/`.

## Styling

The frontend uses project-level CSS files located in `src/App.css` and `src/index.css`.

## Notes

- the app assumes the backend server is already running on port 5000
- the app assumes MongoDB-backed data is available through the backend
- the current project uses browser local storage instead of a more advanced auth/session solution
