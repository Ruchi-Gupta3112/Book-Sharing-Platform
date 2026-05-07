# AI Usage Log

## Project
Book Sharing Platform

## AI Tool Used
- Cursor / Copilot for code assistance, debugging help, refactoring support, documentation guidance, and validation improvements.

## Purpose of AI Usage
AI was used to assist in:
- generating boilerplate and feature code
- improving UI structure and wording
- fixing validation and backend logic issues
- improving help/documentation content
- suggesting better project organization
- preparing documentation outlines

## AI-Assisted Tasks Log

### 1. Project Improvement Planning
**Task**
Improve a basic book-sharing project into a more complete platform.

**How AI Helped**
- suggested enhancements for dashboard, user profile, admin panel, and reading flow
- identified missing features and weak areas in the original implementation

### 2. Borrowed Books in User Profile
**Task**
Show borrowed books in the user profile after clicking borrow.

**How AI Helped**
- identified mismatch between userId and borrowerId in backend
- suggested proper backend and frontend integration for borrowed book tracking

### 3. Read Book Feature
**Task**
Allow users to read borrowed books from their profile.

**How AI Helped**
- suggested adding readContent and readUrl fields to the book model
- helped build a reading modal/interface in the profile page

### 4. Admin Panel Enhancement
**Task**
Make the admin panel more useful.

**How AI Helped**
- suggested adding detailed fields such as description, owner name, language, page count, published year, read URL, and reading content

### 5. Duplicate Title Prevention
**Task**
Prevent the same book title from being added again.

**How AI Helped**
- suggested backend validation logic for case-insensitive duplicate title checking

### 6. Email Validation
**Task**
Validate email format during registration.

**How AI Helped**
- suggested frontend and backend regex validation
- recommended normalizing email to lowercase and trimmed form

### 7. Return Date Validation
**Task**
Restrict return date so it cannot be earlier than borrowing date.

**How AI Helped**
- suggested frontend min date in date picker
- added backend validation for safety

### 8. Help Section Improvement
**Task**
Make the help page easier for first-time users.

**How AI Helped**
- suggested a more detailed onboarding-style help page
- added step-by-step usage guidance and quick-start notes

**How AI Helped**
- suggested structure for API documentation
- suggested architecture documentation sections

## Example Prompts Used
- "Whenever user clicks on borrow book it should be visible in the user profile section and with every book there should be a read option."
- "Make it a proper book sharing platform."
- "The return date should be enabled from the date of borrowing, not before that."
- "Make the help section more detailed so it becomes easy for anyone to use the app."
- "If a book title is already added and another person tries to add it, it should throw an error."
- "While registering, make proper checks that user is entering email in proper format."

## What Was Done Manually
The following parts still required manual understanding and review:
- checking the assignment requirements
- verifying the logic fits the selected problem statement
- reviewing the generated code changes
- deciding final feature scope
- understanding how frontend and backend connect
- Documentation

## Benefits of Using AI
- faster feature development
- easier debugging of backend/frontend mismatches
- better validation and error handling suggestions
- improved wording for UI/help/documentation
- quicker structuring of project documentation

## Limitations / Issues Faced
- AI-generated code still required manual review
- some logic needed correction to match the actual codebase
- backend field names and integration needed careful checking
- documentation and reflection still needed personal understanding

## Learning Outcome
Using AI helped speed up development, but it also showed that understanding the generated code is necessary. Debugging, verifying logic, and integrating frontend/backend changes still required manual thinking and testing.
