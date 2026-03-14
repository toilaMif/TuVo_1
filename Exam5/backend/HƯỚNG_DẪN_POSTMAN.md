# Hướng dẫn Test API bằng Postman

## 1. Cài đặt Postman

- Tải Postman từ: https://www.postman.com/downloads/
- Cài đặt và mở ứng dụng
- Đăng nhập hoặc tạo tài khoản (tùy chọn)

## 2. Import Collection

### Cách 1: Import từ File

1. Mở Postman
2. Click **File** → **Import**
3. Chọn tab **Upload Files**
4. Tìm và chọn file `postman-collection.json` trong thư mục `backend`
5. Click **Import**

### Cách 2: Import Manual

1. Mở Postman
2. Click **+** để tạo request mới
3. Chọn các endpoint từ collection bên dưới

## 3. Thiết lập Environment Variables

Trước khi test, thiết lập các biến:

1. Click **Environments** (góc trái)
2. Click **+** để tạo environment mới
3. Đặt tên: `Note App Dev`
4. Thêm các biến:

| Key     | Value                                       |
| ------- | ------------------------------------------- |
| url     | http://localhost:5000                       |
| token   | (để trống, sẽ cập nhật sau khi login)       |
| user_id | (để trống, sẽ cập nhật sau khi register)    |
| note_id | (để trống, sẽ cập nhật sau khi create note) |

5. Click **Save**

## 4. Đảm bảo Server Đang Chạy

Mở PowerShell/Terminal và chạy:

```bash
cd c:\Users\nguye\OneDrive\Máy tính\TuVo\Exam5\backend
npm run dev
```

Bạn sẽ thấy:

```
Server running on port 5000
MongoDB connected successfully
```

## 5. Test Các Endpoint Theo Thứ Tự

### BƯỚC 1: Test Xác thực (Authentication)

#### 1.1 Register User (Đăng ký)

**Method:** POST  
**URL:** `http://localhost:5000/api/auth/register`

**Headers:**

- Content-Type: application/json

**Body (raw JSON):**

```json
{
  "username": "testuser1",
  "password": "password123456"
}
```

**Lưu ý:**

- Username và password là bắt buộc
- Username không được trùng lặp

**Response:** ✅ 201 Created

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testuser1",
    "isActive": true
  }
}
```

**Lưu ý:** Ghi lại `id` để sử dụng sau

---

#### 1.2 Login User (Đăng nhập)

**Method:** POST  
**URL:** `http://localhost:5000/api/auth/login`

**Headers:**

- Content-Type: application/json

**Body:**

```json
{
  "username": "testuser1",
  "password": "password123456"
}
```

**Response:** ✅ 200 OK

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testuser1",
    "isActive": true
  }
}
```

**Lưu ý:** Ghi lại `token`, dùng cho các request tiếp theo

---

### BƯỚC 2: Test Quản lý Users (Người dùng)

#### 2.1 Get All Users (Xem danh sách người dùng) - **Công khai (Public)**

**Method:** GET  
**URL:** `http://localhost:5000/api/users`

**Headers:** Không cần

**Response:** ✅ 200 OK

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "testuser1",
    "isActive": true,
    "createdAt": "2026-03-14T10:30:00.000Z",
    "updatedAt": "2026-03-14T10:30:00.000Z"
  }
]
```

---

#### 2.2 Create User (Tạo người dùng mới)

**Method:** POST  
**URL:** `http://localhost:5000/api/users`

**Headers:**

- Content-Type: application/json

**Body:**

```json
{
  "username": "newuser",
  "password": "password123456"
}
```

**Response:** ✅ 201 Created

```json
{
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "username": "newuser",
    "isActive": true
  }
}
```

---

#### 2.3 Get User by ID (Xem chi tiết người dùng) - **Cần đăng nhập**

**Method:** GET  
**URL:** `http://localhost:5000/api/users/507f1f77bcf86cd799439011`

**Headers:**

- Authorization: Bearer `[TOKEN]`

**Response:** ✅ 200 OK

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "testuser1",
  "isActive": true,
  "createdAt": "2026-03-14T10:30:00.000Z",
  "updatedAt": "2026-03-14T10:30:00.000Z"
}
```

---

#### 2.4 Update User (Sửa thông tin người dùng) - **Cần đăng nhập**

**Method:** PUT  
**URL:** `http://localhost:5000/api/users/507f1f77bcf86cd799439011`

**Headers:**

- Authorization: Bearer `[TOKEN]`
- Content-Type: application/json

**Body:**

```json
{
  "username": "updatedusername",
  "password": "newpassword123456"
}
```

**Response:** ✅ 200 OK

```json
{
  "message": "User updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "updatedusername",
    "isActive": true
  }
}
```

---

#### 2.5 Toggle User Status (Ẩn/Hiện người dùng) - **Cần đăng nhập**

**Method:** PATCH  
**URL:** `http://localhost:5000/api/users/507f1f77bcf86cd799439011/toggle`

**Headers:**

- Authorization: Bearer `[TOKEN]`

**Body:** Không cần

**Response:** ✅ 200 OK

```json
{
  "message": "User status updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testuser1",
    "isActive": false
  }
}
```

**Lưu ý:** Gọi lại để chuyển trạng thái từ `false` → `true`

---

### BƯỚC 3: Test Quản lý Notes (Ghi chú)

#### 3.1 Get All Notes (Xem danh sách ghi chú) - **Cần đăng nhập**

**Method:** GET  
**URL:** `http://localhost:5000/api/notes`

**Headers:**

- Authorization: Bearer `[TOKEN]`

**Response:** ✅ 200 OK

```json
[
  {
    "_id": "607f1f77bcf86cd799439020",
    "title": "My First Note",
    "content": "This is the content",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testuser1"
    },
    "isActive": true,
    "createdAt": "2026-03-14T11:00:00.000Z",
    "updatedAt": "2026-03-14T11:00:00.000Z"
  }
]
```

---

#### 3.2 Create Note (Tạo ghi chú mới) - **Cần đăng nhập**

**Method:** POST  
**URL:** `http://localhost:5000/api/notes`

**Headers:**

- Authorization: Bearer `[TOKEN]`
- Content-Type: application/json

**Body:**

```json
{
  "title": "My First Note",
  "content": "This is the content of my first note"
}
```

**Response:** ✅ 201 Created

```json
{
  "message": "Note created successfully",
  "note": {
    "_id": "607f1f77bcf86cd799439020",
    "title": "My First Note",
    "content": "This is the content of my first note",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testuser1"
    },
    "isActive": true,
    "createdAt": "2026-03-14T11:00:00.000Z",
    "updatedAt": "2026-03-14T11:00:00.000Z"
  }
}
```

**Lưu ý:**

- Title phải duy nhất cho mỗi user
- Ghi lại `_id` để sử dụng sau

---

#### 3.3 Get Note by ID (Xem chi tiết ghi chú) - **Cần đăng nhập**

**Method:** GET  
**URL:** `http://localhost:5000/api/notes/607f1f77bcf86cd799439020`

**Headers:**

- Authorization: Bearer `[TOKEN]`

**Response:** ✅ 200 OK

```json
{
  "_id": "607f1f77bcf86cd799439020",
  "title": "My First Note",
  "content": "This is the content of my first note",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "testuser1"
  },
  "isActive": true,
  "createdAt": "2026-03-14T11:00:00.000Z",
  "updatedAt": "2026-03-14T11:00:00.000Z"
}
```

---

#### 3.4 Update Note (Sửa ghi chú) - **Cần đăng nhập**

**Method:** PUT  
**URL:** `http://localhost:5000/api/notes/607f1f77bcf86cd799439020`

**Headers:**

- Authorization: Bearer `[TOKEN]`
- Content-Type: application/json

**Body:**

```json
{
  "title": "Updated Note Title",
  "content": "Updated content of the note"
}
```

**Response:** ✅ 200 OK

```json
{
  "message": "Note updated successfully",
  "note": {
    "_id": "607f1f77bcf86cd799439020",
    "title": "Updated Note Title",
    "content": "Updated content of the note",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testuser1"
    },
    "isActive": true,
    "createdAt": "2026-03-14T11:00:00.000Z",
    "updatedAt": "2026-03-14T11:00:30.000Z"
  }
}
```

---

#### 3.5 Toggle Note Status (Ẩn/Hiện ghi chú) - **Cần đăng nhập**

**Method:** PATCH  
**URL:** `http://localhost:5000/api/notes/607f1f77bcf86cd799439020/toggle`

**Headers:**

- Authorization: Bearer `[TOKEN]`

**Body:** Không cần

**Response:** ✅ 200 OK

```json
{
  "message": "Note status updated successfully",
  "note": {
    "_id": "607f1f77bcf86cd799439020",
    "title": "Updated Note Title",
    "content": "Updated content of the note",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testuser1"
    },
    "isActive": false,
    "createdAt": "2026-03-14T11:00:00.000Z",
    "updatedAt": "2026-03-14T11:00:30.000Z"
  }
}
```

---

## 6. Test Validation & Error Handling

### Kiểm tra Validation

#### Test 1: Username Trống

```json
{
  "username": "",
  "password": "password123456"
}
```

**Response:** ❌ 400 Bad Request

```json
{
  "errors": [
    {
      "msg": "Username is required",
      "param": "username",
      "location": "body"
    }
  ]
}
```

#### Test 2: Password Missing

```json
{
  "username": "testuser"
}
```

**Response:** ❌ 400 Bad Request

```json
{
  "errors": [
    {
      "msg": "Password is required",
      "param": "password",
      "location": "body"
    }
  ]
}
```

#### Test 3: Title Trùng Lặp (Khi Tạo Note)

```json
{
  "title": "My First Note",
  "content": "Another content"
}
```

**Response:** ❌ 400 Bad Request

```json
{
  "message": "Title already exists for this user"
}
```

#### Test 4: Không Có Token (Protected Endpoint)

**Method:** GET  
**URL:** `http://localhost:5000/api/notes`

**Headers:** Không có Authorization

**Response:** ❌ 401 Unauthorized

```json
{
  "message": "No token provided. Please login first."
}
```

#### Test 5: Token Invalid

**Headers:**

- Authorization: Bearer invalid_token_here

**Response:** ❌ 401 Unauthorized

```json
{
  "message": "Invalid token. Please login again."
}
```

---

## 7. Mẹo Sử Dụng Postman

### Sử dụng Environment Variables

1. Sau khi Login, sao chép token
2. Vào **Environments**
3. Cập nhật giá trị `token`
4. Trong các request khác, dùng `{{token}}` thay vì paste token

### Lưu Request Thường Dùng

- Chọn request → Click **Save as**
- Đặt tên và chọn collection

### Kiểm tra Response Status

- Dòng trên cùng hiển thị status code
- Xanh (2xx, 3xx) = Thành công
- Đỏ (4xx, 5xx) = Lỗi

### Console & Network

- Click **Console** (dưới Postman)
- Xem logs của request và response
- Giúp debug lỗi

---

## 8. Checklist Test Toàn Bộ

### Authentication (Xác thực)

- [x] ✅ Register user thành công
- [x] ✅ Login với credentials đúng
- [x] ✅ Reject login với password sai
- [x] ✅ Reject login user inactive

### Users Management (Quản lý Người dùng)

- [x] ✅ Get all users (public)
- [x] ✅ Create user mới
- [x] ✅ Get user by ID (require auth)
- [x] ✅ Update user info
- [x] ✅ Toggle user status (ẩn/hiện)
- [x] ✅ Validate username unique
- [x] ✅ Validate username is required

### Notes Management (Quản lý Ghi chú)

- [x] ✅ Get all notes của user
- [x] ✅ Create note mới
- [x] ✅ Get note by ID
- [x] ✅ Update note
- [x] ✅ Toggle note status
- [x] ✅ Validate title unique per user
- [x] ✅ Require auth for note endpoints

---

## 9. Troubleshooting

| Vấn đề                   | Giải pháp                                     |
| ------------------------ | --------------------------------------------- |
| Connection refused       | Kiểm tra server có chạy không: `npm run dev`  |
| 401 Unauthorized         | Kiểm tra token format: `Bearer <token>`       |
| 400 Bad Request          | Kiểm tra JSON syntax, không có trailing comma |
| MongoDB connection error | Kiểm tra MongoDB có đang chạy không           |
| Port 5000 in use         | Chạy: `taskkill /PID <pid> /F`                |

---

**Hoàn tất! Bạn đã test toàn bộ API hệ thống.**
