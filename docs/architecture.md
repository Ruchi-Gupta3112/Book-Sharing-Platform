# Architecture Documentation

## Project Title
Book Sharing Platform

## Problem Statement
The purpose of this project is to build a full-stack web application that allows users to share, borrow, read, and return books in a simple and user-friendly way. The system helps manage book availability, borrowing records, and user activity through a web interface.

## Technology Stack

### Frontend
- React
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

## High-Level Architecture
The application follows a client-server architecture:

1. The React frontend provides the user interface.
2. The frontend sends HTTP requests to the Express backend.
3. The backend processes requests, applies validations and business logic, and interacts with MongoDB.
4. MongoDB stores users, books, and borrow request data.
5. The backend returns JSON responses to the frontend, which updates the UI.

## Main Modules

### 1. Authentication Module
This module handles:
- user registration
- login
- basic token generation
- storing user session data in local storage

### 2. Book Management Module
This module handles:
- listing all books
- adding books from admin panel
- preventing duplicate titles
- storing additional details like description, reading content, and reading URL

### 3. Borrowing Module
This module handles:
- borrowing books
- validating return dates
- marking books as unavailable after borrowing
- returning books and making them available again

### 4. User Profile Module
This module handles:
- showing borrowed books for the logged-in user
- opening reading content
- tracking reading-related stats
- returning borrowed books

### 5. Help and Guidance Module
This module provides:
- onboarding information
- user instructions
- app usage guidance for first-time users

## Data Flow

### Borrow Book Flow
1. User logs in.
2. User opens the dashboard.
3. Frontend fetches available books from backend.
4. User selects a return date and clicks borrow.
5. Frontend sends borrow request to backend.
6. Backend validates and creates a borrow request.
7. Backend updates book status to borrowed.
8. Frontend refreshes the book list and profile data.

### Read Book Flow
1. User opens My Profile.
2. Frontend fetches borrowed books from backend.
3. User clicks Read now.
4. Stored reading content or reading URL is shown.

### Return Book Flow
1. User opens My Profile.
2. User clicks Return book.
3. Frontend sends return request to backend.
4. Backend marks borrow request as returned.
5. Backend updates book status to available again.

## Backend Structure
### Models
- User
- Book
- BorrowRequest

### Routes
- userRoutes.js
- bookRoutes.js
- borrowRoutes.js

### Server
- server.js initializes Express, middleware, database connection, and route mounting

## Frontend Structure
### Pages
- LoginPage
- Dashboard
- UserProfile
- AdminPanel
- Help

### Components
- Navbar
- BookCard

### Main App
- App.js handles routes and navigation behavior

## Database Entities

### User
Stores:
- name
- email
- password
- role

### Book
Stores:
- title
- author
- genre
- description
- ownerName
- language
- pageCount
- publishedYear
- readContent
- readUrl
- availability status

### BorrowRequest
Stores:
- borrowed book reference
- borrower reference
- borrow date
- return date
- due date
- status
- returnedAt

## Design Decisions
- React was used because it supports component-based UI and routing well.
- Express was used because it is lightweight and easy to build REST APIs with.
- MongoDB was chosen because the project data is document-based and flexible.
- Token-based login was simulated to keep the assignment practical and focused.
- Reading content was stored as text to make the profile reading feature easy to demonstrate.

## Possible Future Improvements
- role-based authorization middleware
- edit/delete books
- book cover image upload
- search by multiple filters on backend
- notification system for due dates
- admin approval flow for borrow requests
- deployment on cloud platforms

## Conclusion
The Book Sharing Platform is a complete full-stack application that demonstrates frontend-backend integration, database persistence, user authentication, borrowing logic, and user-focused UI design.
