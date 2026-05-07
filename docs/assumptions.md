# Assumptions and Scope Notes

## Environment Assumptions

- MongoDB is available locally at `mongodb://localhost:27017/bookshare`
- the backend runs on port `5000`
- the frontend runs on port `3000`
- frontend and backend are started separately

## Functional Assumptions

- any registered user can log in and use the dashboard
- books are borrowed immediately after the borrow request is submitted
- each book can have only one active borrower at a time
- a returned book becomes available immediately
- reading content is either stored directly in the book record or opened through an external link
- duplicate titles should be prevented even if users type different letter casing

## UX Assumptions

- the dashboard is the main landing page after login
- the profile page is the central place for reading and returning borrowed books
- the help page should be enough for a first-time user to understand the workflow
- the admin panel is used to enrich the catalog with readable content and metadata

## Security and Auth Assumptions

- token generation is sufficient for the current project scope
- route protection on the frontend is based on token presence in local storage
- backend authorization middleware is outside the current implementation scope
- the app is being treated as a local/demo project rather than a production-ready platform

## Documentation Assumptions

- project readers may need separate backend and frontend start commands
- documentation should reflect the exact local run pattern: `node server.js` for backend and `npm start` for frontend
- the docs should explain both the user flow and the technical structure for assignment or review purposes

