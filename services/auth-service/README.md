# UniBot Authentication Service

A production-ready authentication microservice built with Node.js, Express, and Firebase.

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────▶│ API Gateway  │────▶│ AWS Lambda  │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   Express   │
                                        │     App     │
                                        └──────┬──────┘
                                               │
┌─────────────────────────────────────────────────────────────────────┐
│                           Middleware Stack                          │
├─────────────────────────────────────────────────────────────────────┤
│  Helmet  │ CORS  │ Rate Limit  │ Validation  │ Token Verify  │ Role  │
└─────────────────────────────────────────────────────────────────────┘
                                               │
                        ┌──────────────────────────────┐
                        ▼                              ▼
              ┌──────────────────┐          ┌──────────────────┐
              │   Auth Routes      │          │   Controllers    │
              └──────────────────┘          └────────┬─────────┘
                                                       │
                                                       ▼
                                              ┌──────────────────┐
                                              │   Auth Service   │
                                              └────────┬─────────┘
                                                       │
                                      ┌─────────────────────────────┐
                                      ▼                             ▼
                             ┌───────────────┐            ┌───────────────┐
                             │ Firebase Auth │            │   Firestore   │
                             └───────────────┘            └───────────────┘
```

## API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/register` | No | - | Register new user |
| POST | `/auth/login` | No | - | Authenticate user |
| POST | `/auth/verify-token` | No | - | Verify token validity |
| GET | `/auth/profile` | Yes | - | Get user profile |
| PUT | `/auth/profile` | Yes | - | Update profile |
| POST | `/auth/logout` | Yes | - | Revoke tokens |
| GET | `/auth/admin` | Yes | Admin | Admin-only endpoint |

## Request/Response Examples

### Register User

**Request:**
```json
POST /auth/register
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "securePassword123",
  "name": "Alex Johnson",
  "role": "student"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "uid": "abc123xyz",
    "email": "student@university.edu",
    "name": "Alex Johnson",
    "role": "student"
  }
}
```

### Login

**Request:**
```json
POST /auth/login
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "uid": "abc123xyz",
    "email": "student@university.edu",
    "name": "Alex Johnson",
    "role": "student",
    "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
  }
}
```

### Get Profile (Protected)

**Request:**
```
GET /auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "uid": "abc123xyz",
    "name": "Alex Johnson",
    "email": "student@university.edu",
    "role": "student",
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## File Structure

```
auth-service/
├── src/
│   ├── config/
│   │   ├── firebase.js    # Firebase Admin SDK initialization
│   │   └── jwt.js         # JWT configuration
│   ├── controllers/
│   │   └── auth.controller.js  # Request handlers
│   ├── middleware/
│   │   ├── authMiddleware.js   # Base auth middleware
│   │   ├── roleMiddleware.js     # Role-based access control
│   │   ├── errorMiddleware.js  # Centralized error handling
│   │   └── verifyToken.js      # JWT verification
│   ├── routes/
│   │   └── auth.routes.js      # API route definitions
│   ├── service/
│   │   └── auth.service.js     # Business logic layer
│   └── utils/
│       ├── logger.js           # Logging utility
│       ├── tokenUtils.js       # JWT token utilities
│       ├── validator.js        # Joi validation schemas
│       └── validators.js       # Response helpers
├── app.js                      # Express app configuration
├── lambda.js                   # AWS Lambda handler
├── serverless.yml              # Serverless deployment config
└── package.json
```

## Environment Variables

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@project.iam.gserviceaccount.com

# JWT Configuration


# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# AWS Configuration
AWS_REGION=us-east-1
```

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your Firebase credentials in .env

# Run development server
npm run dev

# Server will start at http://localhost:3000
```

## Deployment

### Prerequisites
1. AWS CLI configured with credentials
2. Firebase project with service account key
3. Serverless Framework installed (`npm install -g serverless`)

### Deploy to AWS Lambda

```bash
# Set environment variables
export FIREBASE_PROJECT_ID="your-project-id"
export FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
export FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@project.iam.gserviceaccount.com"


# Deploy
npm run deploy
```

### Serverless Output
After deployment, Serverless Framework will output the API Gateway URL:
```
Service Information
service: unibot-auth-service
stage: dev
region: us-east-1
stack: unibot-auth-service-dev
resources: 12
api keys:
  None
endpoints:
  ANY - https://xxxxxx.execute-api.us-east-1.amazonaws.com/prod/{proxy+}
```

## Security Features

1. **Rate Limiting**: 20 requests per 15 minutes per IP
2. **Input Validation**: Joi schemas validate all inputs
3. **Role-Based Access**: Middleware restricts endpoints by role
4. **Secure Headers**: Helmet sets security-related HTTP headers
5. **Token Verification**: Firebase Admin SDK verifies JWT tokens
6. **CORS**: Configurable origin whitelist

## Error Responses

All errors follow a consistent format:
```json
{
  "success": false,
  "error": "Error message",
  "details": ["Additional error details"]
}
```

Common HTTP status codes:
- 400: Validation error
- 401: Authentication required / Invalid token
- 403: Access denied (insufficient permissions)
- 404: Resource not found
- 409: Conflict (e.g., email already exists)
- 500: Internal server error