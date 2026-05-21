# Authentication Service - API Testing Guide

## Environment Setup
```bash
cp .env.example .env
# Fill in your Firebase credentials
npm install
npm start
```

## API Endpoints

### 1. Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "student"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "uid": "firebase-uid-123",
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "\"password\" length must be at least 8 characters long"
  ]
}
```

**Error Response (409 - Conflict):**
```json
{
  "success": false,
  "error": "Email already registered"
}
```

### 2. Verify Token
```bash
POST /auth/verify-token
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "uid": "firebase-uid-123",
    "role": "student"
  }
}
```

### 3. Get Profile (Protected)
```bash
GET /auth/profile
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "uid": "firebase-uid-123",
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student",
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "No token provided"
}
```

### 4. Update Profile (Protected)
```bash
PUT /auth/profile
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+1234567890"
}
```

### 5. Logout (Protected)
```bash
POST /auth/logout
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

## Postman Collection JSON

Import this into Postman:

```json
{
  "info": {
    "name": "UniBot Auth Service",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"student@example.com\",\n  \"password\": \"password123\",\n  \"name\": \"John Doe\",\n  \"role\": \"student\"\n}"
        },
        "url": "{{baseUrl}}/auth/register"
      }
    },
    {
      "name": "Verify Token",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "url": "{{baseUrl}}/auth/verify-token"
      }
    },
    {
      "name": "Get Profile",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
        "url": "{{baseUrl}}/auth/profile"
      }
    }
  ]
}
```

## Environment Variables for Postman
```
baseUrl: http://localhost:3000
token: <your-firebase-id-token>
```