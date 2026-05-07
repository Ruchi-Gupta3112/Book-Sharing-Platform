# Component Hierarchy

## Frontend Tree

```text
App
|-- Router
|   |-- Navbar (shown only when a token exists)
|   |-- Routes
|       |-- / -> LoginPage
|       |-- /dashboard -> Dashboard
|       |-- /admin -> AdminPanel
|       |-- /help -> Help
|       `-- /profile -> UserProfile
```

## Page-Level Breakdown

### `App`
Responsibilities:
- reads `token` and `user` from local storage
- keeps session state in React state
- conditionally shows the navbar
- protects authenticated routes

### `Navbar`
Responsibilities:
- shows primary navigation links
- displays the current user name
- clears local storage on logout
- redirects the user back to the landing page

### `LoginPage`
Responsibilities:
- toggles between login and register modes
- validates email format on the client
- sends auth requests to the backend
- stores session data after login

### `Dashboard`
Responsibilities:
- loads the catalog from the API
- computes genre filter options from available books
- manages search text and return-date selections
- triggers borrow requests
- renders the main book grid

### `AdminPanel`
Responsibilities:
- manages the add-book form state
- submits rich book metadata to the backend
- resets the form after success

### `Help`
Responsibilities:
- provides onboarding content
- renders collapsible help sections
- explains the main user flow of the app

### `UserProfile`
Responsibilities:
- loads user profile data and borrowed books
- displays reading-related stats
- opens and closes the reader modal
- submits return-book actions

## Reusable Components

### `BookCard`
A standalone card component exists in `src/components/BookCard.js`. The current dashboard implementation renders its own book cards directly instead of using this shared component, but the file remains part of the frontend structure.

## State Overview

### Global-like session state in `App`
- `token`
- `user`

### Local state in `LoginPage`
- login/register mode
- form fields
- loading state

### Local state in `Dashboard`
- `books`
- `searchTerm`
- `genreFilter`
- `borrowSelections`
- `loading`

### Local state in `AdminPanel`
- add-book form values

### Local state in `Help`
- currently open help section

### Local state in `UserProfile`
- `borrowedBooks`
- `stats`
- `selectedBook`
- `profileUser`

## Data Flow Summary

1. `App` decides whether the user is authenticated.
2. Child pages call the backend directly with Axios.
3. Successful backend responses update each page's local state.
4. Borrow and return actions refresh the affected views by fetching data again.
