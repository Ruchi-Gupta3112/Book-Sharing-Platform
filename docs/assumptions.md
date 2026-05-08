# Assumptions and Scope Notes

## Environment Assumptions

- MongoDB is available locally at `mongodb://localhost:27017/bookshare`
- the backend runs on port `5000`
- the frontend runs on port `3000`
- frontend and backend are started separately
- existing older book records may be normalized on read to add missing inventory fields

## Functional Assumptions

- any registered user can log in and use the dashboard
- books are borrowed immediately after the borrow request is submitted
- each title can have multiple copies
- each borrow action reduces available inventory by one copy
- a returned copy becomes available immediately
- reading content is either stored directly in the book record or opened through an external link
- adding the same title again should increase the copy count instead of creating a separate duplicate entry

## UX Assumptions

- the dashboard is the main landing page after login
- the profile page is the central place for reading and returning borrowed books
- the help page should be enough for a first-time user to understand the workflow
- the admin panel is used to enrich the catalog with readable content, metadata, and copy counts

## Security and Auth Assumptions

- token generation is sufficient for the current project scope
- route protection on the frontend is based on token presence in local storage
- backend authorization middleware is outside the current implementation scope
- the app is being treated as a local/demo project rather than a production-ready platform

## Documentation Assumptions

- project readers may need separate backend and frontend start commands
- documentation should reflect the exact local run pattern: `node server.js` for backend and `npm start` for frontend
- the docs should explain both the user flow and the technical structure for assignment or review purposes

## Out-of-Scope Items for the Current Version

- social sharing features beyond borrowing and returning
- payment flows or fines
- notifications and reminders
- file uploads for book cover storage
- advanced admin moderation workflows
- automated testing coverage
- deployment configuration for production hosting
