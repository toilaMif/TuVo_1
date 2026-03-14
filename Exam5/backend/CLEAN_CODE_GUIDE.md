# Backend Clean Code & Project Organization

## Project Structure Overview

```
backend/
├── models/
│   ├── User.js          # User database schema and validation
│   └── Note.js          # Note database schema with unique constraints
├── controllers/
│   ├── authController.js     # Authentication logic (login/register)
│   ├── userController.js     # User CRUD operations
│   └── noteController.js     # Note CRUD operations
├── routes/
│   ├── auth.js          # Auth endpoints
│   ├── users.js         # User endpoints
│   └── notes.js         # Note endpoints
├── middleware/
│   └── auth.js          # JWT verification middleware
├── .env                 # Environment variables (not in Git)
├── .gitignore           # Git ignore file
├── server.js            # Express app setup
├── package.json         # Dependencies
├── API_DOCUMENTATION.md # Complete API reference
└── README.md            # This file
```

## Architecture Pattern: MVC (Model-View-Controller)

- **Model**: Database schemas with validation (`/models`)
- **Controller**: Business logic and data processing (`/controllers`)
- **View**: API endpoints (`/routes`)
- **Middleware**: Cross-cutting concerns like authentication

## Code Organization Principles

### 1. Separation of Concerns

Each file has a single responsibility:

- `models/` - Define schemas and database structure
- `controllers/` - Implement business logic
- `routes/` - Define API endpoints
- `middleware/` - Handle authentication/authorization

### 2. Meaningful Naming Conventions

**Files & Directories**:

- Use lowercase with camelCase for files: `userController.js`
- Use descriptive names: `authController.js` not `auth.js`
- Group related files in directories: all controllers in `/controllers`

**Variables & Functions**:

- Use descriptive names: `getUserById()` not `getUser()`
- Use booleans starting with 'is' or 'has': `isActive`, `hasToken`
- Use action verbs for functions: `createUser()`, `updateNote()`
- Use nouns for objects/data: `user`, `note`, `token`

**Examples**:

```javascript
// Good
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

// Bad
const get_user = async (id) => {
  const u = await User.findById(id);
  return u;
};
```

### 3. Consistent Code Style

**Spacing & Formatting**:

- 2 spaces for indentation (configured in ESLint)
- One blank line between functions
- Use semicolons at end of statements

**Error Handling**:

```javascript
// Good - Always handle errors
try {
  const user = await User.findById(id);
  res.json(user);
} catch (err) {
  res.status(500).json({ message: "Error fetching user" });
}

// Bad - No error handling
const user = await User.findById(id);
res.json(user);
```

### 4. Validation & Data Integrity

**Always validate input**:

```javascript
// Keep validation rules close to where they're used
const createUser = [
  body("username").notEmpty().withMessage("Username required"),
  body("password").isLength({ min: 6 }).withMessage("Min 6 chars"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... rest of logic
  },
];
```

### 5. Security Best Practices

**Password Security**:

- Always hash passwords with bcrypt
- Use salt rounds of 10+
- Never return password in responses

**Token Security**:

- Use JWT with expiration
- Store secret in environment variables
- Validate token on protected routes

**Database Security**:

- Use unique constraints for email/username
- Validate input to prevent injection attacks
- Use Mongoose select() to exclude sensitive fields

## API Endpoint Guidelines

### Naming Convention

- Use lowercase and hyphens: `/api/users`, `/api/notes`
- Use nouns not verbs: `/api/users` not `/api/getUsers`
- Use HTTP methods for actions:
  - GET - Retrieve data
  - POST - Create data
  - PUT - Update complete resource
  - PATCH - Partial update

### URL Parameters

```javascript
// Good: RESTful conventions
GET  /api/users          // Get all users
GET  /api/users/:id      // Get specific user
POST /api/users          // Create user
PUT  /api/users/:id      // Update user completely
PATCH /api/users/:id/toggle  // Partial update (toggle status)

// Bad: Not RESTful
GET  /api/getUsers
GET  /api/getUserById/:id
POST /api/createUser
```

### Response Format

Always return consistent JSON structure:

```javascript
// Success response
{
  "message": "Operation successful",
  "user": { ... },
  "token": "JWT_TOKEN"
}

// Error response
{
  "message": "Error description",
  "errors": [
    { "msg": "Field error", "param": "fieldName" }
  ]
}
```

## Model Design

### User Model

```javascript
// Clear schema with proper types and constraints
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Enforced uniqueness
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
```

### Note Model

```javascript
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Compound unique index: each user has unique titles
noteSchema.index({ title: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Note", noteSchema);
```

## Controller Best Practices

### 1. Separation of Logic

```javascript
// Good: Separate validation, business logic, and response
const updateUser = [
  // Validation layer
  body("username").optional().isLength({ min: 3 }),

  // Logic layer
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username },
      { new: true },
    );

    // Response layer
    res.json({ message: "Updated", user });
  },
];

// Bad: Mixed logic
const updateUser = async (req, res) => {
  // No validation
  const u = await User.updateOne({ _id: req.params.id }, req.body);
  res.json(u);
};
```

### 2. Error Messages

```javascript
// Good: Clear and actionable error messages
if (existingUser) {
  return res.status(400).json({
    message: "Username already exists",
  });
}

// Bad: Vague error message
if (existingUser) {
  return res.status(400).json({ message: "Error" });
}
```

### 3. Consistent Response Structure

```javascript
// Create
res.status(201).json({
  message: "User created successfully",
  user: { id, username, isActive },
});

// Update
res.json({
  message: "User updated successfully",
  user: { id, username, isActive },
});

// Delete/Toggle
res.json({
  message: "User status updated successfully",
  user: { id, username, isActive },
});
```

## Middleware Best Practices

### Authentication Middleware

```javascript
// Clear error messages for different scenarios
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // No token
  if (!token) {
    return res.status(401).json({
      message: "No token provided. Please login first.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Token expired
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again.",
      });
    }

    // Invalid token
    res.status(401).json({
      message: "Invalid token. Please login again.",
    });
  }
};
```

## Environment Configuration

```bash
# .env file (never commit to Git)
MONGO_URI=mongodb://localhost:27017/noteapp
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

## Dependencies Used

| Package           | Purpose               | Version      |
| ----------------- | --------------------- | ------------ |
| express           | Web framework         | ^4.18.2      |
| mongoose          | MongoDB ODM           | ^7.5.0       |
| bcryptjs          | Password hashing      | ^2.4.3       |
| jsonwebtoken      | JWT tokens            | ^9.0.2       |
| express-validator | Input validation      | ^7.0.1       |
| cors              | CORS middleware       | ^2.8.5       |
| dotenv            | Environment variables | ^16.3.1      |
| nodemon           | Dev server reload     | ^3.0.1 (dev) |

## Running the Backend

```bash
# Install dependencies
npm install

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## Key Files Checklist

- ✅ Models define clear schemas with validation
- ✅ Controllers have business logic separated from routes
- ✅ Routes are organized by feature
- ✅ Middleware handles cross-cutting concerns
- ✅ Error handling is consistent across all endpoints
- ✅ Environment variables are used for sensitive data
- ✅ Database constraints enforce data integrity
- ✅ Input validation prevents invalid data
- ✅ Response format is consistent
- ✅ Code is readable with meaningful names

---

_Last Updated: 2026-03-14_
