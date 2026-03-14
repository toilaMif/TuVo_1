# Note Management & User Management System - Backend API Documentation

## Project Structure

```
backend/
├── models/              # Database schemas
│   ├── User.js         # User model
│   └── Note.js         # Note model
├── controllers/        # Business logic
│   ├── authController.js
│   ├── userController.js
│   └── noteController.js
├── routes/            # API endpoints
│   ├── auth.js
│   ├── users.js
│   └── notes.js
├── middleware/        # Custom middleware
│   └── auth.js        # JWT authentication
├── .env               # Environment variables
├── server.js          # Express server
└── package.json       # Dependencies
```

## Database Models

### User Model

```javascript
{
  username: String (unique, required, min: 3 chars),
  password: String (hashed with bcrypt, required, min: 6 chars),
  isActive: Boolean (default: true),
  timestamps: { createdAt, updatedAt }
}
```

### Note Model

```javascript
{
  title: String (required, unique per user),
  content: String (required),
  user: ObjectId (reference to User, required),
  isActive: Boolean (default: true),
  timestamps: { createdAt, updatedAt }
}
```

## API Endpoints

### Authentication API

#### 1. User Registration

- **POST** `/api/auth/register`
- **Public**: Yes
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "password": "password123"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "ObjectId",
      "username": "john_doe",
      "isActive": true
    }
  }
  ```
- **Validation**:
  - Username: required
  - Password: required
  - Username must be unique

#### 2. User Login

- **POST** `/api/auth/login`
- **Public**: Yes
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "password": "password123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "message": "Login successful",
    "token": "JWT_TOKEN",
    "user": {
      "id": "ObjectId",
      "username": "john_doe",
      "isActive": true
    }
  }
  ```
- **Errors**:
  - 401: Invalid username or password
  - 403: User account is inactive

---

### Users Management API

#### 1. Get All Users

- **GET** `/api/users`
- **Public**: Yes
- **Response** (200 OK):
  ```json
  [
    {
      "_id": "ObjectId",
      "username": "user1",
      "isActive": true,
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
  ```

#### 2. Get User by ID

- **GET** `/api/users/:id`
- **Auth Required**: Yes (Bearer token in Authorization header)
- **Response** (200 OK):
  ```json
  {
    "_id": "ObjectId",
    "username": "user1",
    "isActive": true,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ```

#### 3. Create New User

- **POST** `/api/users`
- **Public**: Yes
- **Request Body**:
  ```json
  {
    "username": "new_user",
    "password": "password123"
  }
  ```
- **Response** (201 Created): Same as registration response

#### 4. Update User

- **PUT** `/api/users/:id`
- **Auth Required**: Yes
- **Request Body** (all optional):
  ```json
  {
    "username": "updated_username",
    "password": "newpassword123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "message": "User updated successfully",
    "user": {
      "_id": "ObjectId",
      "username": "updated_username",
      "isActive": true
    }
  }
  ```

#### 5. Toggle User Status (Hide/Show)

- **PATCH** `/api/users/:id/toggle`
- **Auth Required**: Yes
- **Response** (200 OK):
  ```json
  {
    "message": "User status updated successfully",
    "user": {
      "id": "ObjectId",
      "username": "user1",
      "isActive": false
    }
  }
  ```

---

### Notes Management API

#### 1. Get User's Notes

- **GET** `/api/notes`
- **Auth Required**: Yes
- **Response** (200 OK):
  ```json
  [
    {
      "_id": "ObjectId",
      "title": "My First Note",
      "content": "Note content here",
      "user": { "_id": "ObjectId", "username": "john_doe" },
      "isActive": true,
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
  ```

#### 2. Get Note by ID

- **GET** `/api/notes/:id`
- **Auth Required**: Yes
- **Response** (200 OK): Single note object (same as above)

#### 3. Create New Note

- **POST** `/api/notes`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "title": "My New Note",
    "content": "Content of the note"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "message": "Note created successfully",
    "note": {
      "_id": "ObjectId",
      "title": "My New Note",
      "content": "Content of the note",
      "user": { "_id": "ObjectId", "username": "john_doe" },
      "isActive": true,
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```
- **Validation**:
  - Title: required, unique per user
  - Content: required

#### 4. Update Note

- **PUT** `/api/notes/:id`
- **Auth Required**: Yes
- **Request Body** (all optional):
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "message": "Note updated successfully",
    "note": { ...updated note object }
  }
  ```

#### 5. Toggle Note Status (Hide/Show)

- **PATCH** `/api/notes/:id/toggle`
- **Auth Required**: Yes
- **Response** (200 OK):
  ```json
  {
    "message": "Note status updated successfully",
    "note": { ...toggled note object }
  }
  ```

---

## Error Response Format

All errors follow this format:

```json
{
  "message": "Error description",
  "errors": [
    {
      "msg": "Validation error message",
      "param": "field_name"
    }
  ]
}
```

## Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (no token or invalid token)
- **403**: Forbidden (inactive user)
- **404**: Not Found
- **500**: Internal Server Error

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

The token is valid for 1 hour.

## Environment Variables

Create a `.env` file in the backend directory:

```
MONGO_URI=mongodb://localhost:27017/noteapp
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file with MongoDB URI and JWT secret

3. Start MongoDB service

4. Run the server:
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production
   ```

The server will run on `http://localhost:5000`

---

## Testing the API

### Using cURL

#### Register and Login

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123456"}'
```

#### Create Note (requires token)

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"My Note","content":"Note content"}'
```

### Using Postman

1. Import the API endpoints
2. For protected routes, add Authorization header:
   - Type: Bearer Token
   - Token: <JWT_TOKEN>
3. Test each endpoint

---
