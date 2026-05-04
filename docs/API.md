# API Documentation

## Base URL
http://localhost:5000/api

## Overview
This project uses a Node.js + Express backend with MongoDB for storing users, books, and borrow records.

The main API groups are:
- users for authentication and profile-related data
- books for viewing and adding books
- borrow for borrowing and returning books

## 1. User APIs

### 1.1 Register User
**Endpoint**
POST /api/users/register

**Description**
Creates a new user account.

**Request Body**
{
  "name": "Rahul Gupta",
  "email": "rahul@example.com",
  "password": "mypassword123"
}

**Validation**
- name is required
- email must be in valid format
- password is required
- duplicate email is not allowed

**Success Response**
{
  "message": "User registered successfully",
  "user": {
    "id": "6635b8c1234567890abcd111",
    "name": "Rahul Gupta",
    "email": "rahul@example.com",
    "role": "user"
  }
}

### 1.2 Login User
**Endpoint**
POST /api/users/login

**Description**
Authenticates a user and returns a token.

**Request Body**
{
  "email": "rahul@example.com",
  "password": "mypassword123"
}

**Success Response**
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

### 1.3 Get Borrowed Books for a User
**Endpoint**
GET /api/users/:userId/borrowed

**Description**
Returns the list of currently borrowed books for a given user.

### 1.4 Get User Profile Data
**Endpoint**
GET /api/users/:userId/profile

**Description**
Returns user details, borrowed books, and profile statistics.

## 2. Book APIs

### 2.1 Get All Books
**Endpoint**
GET /api/books

**Description**
Returns all books in the platform.

### 2.2 Add a New Book
**Endpoint**
POST /api/books

**Description**
Adds a new book to the shared library.

**Validation**
- title is required
- duplicate book titles are not allowed
- title comparison is case-insensitive

## 3. Borrow APIs

### 3.1 Borrow a Book
**Endpoint**
POST /api/borrow/:bookId

**Description**
Allows a user to borrow a book if it is available.

**Request Body**
{
  "userId": "6635b8c1234567890abcd111",
  "returnDate": "2026-05-10"
}

**Validation**
- userId is required
- return date cannot be before the borrowing date
- book must exist
- book must not already be borrowed

### 3.2 Return a Book
**Endpoint**
POST /api/borrow/:requestId/return

**Description**
Marks a borrowed book as returned and makes it available again.

## Error Responses

### Invalid Email
{
  "message": "Please enter a valid email address"
}

### Duplicate Book Title
{
  "message": "This book title has already been added to the platform"
}

### Already Borrowed
{
  "message": "Book already borrowed"
}

### Invalid Return Date
{
  "message": "Return date cannot be earlier than the borrowing date"
}

## Notes
- Authentication is token-based and simulated for assignment purposes.
- Role handling is basic and can be extended further.
- API testing can be done using Postman.
