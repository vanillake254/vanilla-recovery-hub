# API Examples - Vanilla Recovery Hub

Test these endpoints with curl, Postman, or your HTTP client of choice.

## Base URL
- **Local:** `http://localhost:5000`
- **Production:** `https://your-railway-app.railway.app`

---

## 1. Create Recovery Request

**Endpoint:** `POST /api/requests/create`

```bash
curl -X POST http://localhost:5000/api/requests/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "platform": "facebook",
    "description": "My Facebook account was hacked 2 days ago. I can no longer access it with my password.",
    "hasEmailAccess": true
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Recovery request created successfully",
  "data": {
    "requestId": "65a1b2c3d4e5f6789abcdef0",
    "tx_ref": "VRH-1703001234567-ABCD1234",
    "platform": "facebook",
    "status": "new",
    "paymentStatus": "pending",
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

## 2. Initiate Payment

**Endpoint:** `POST /api/payments/initiate`

```bash
curl -X POST http://localhost:5000/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "requestId": "65a1b2c3d4e5f6789abcdef0",
    "amount": 1500,
    "tier": "basic"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "paymentLink": "https://checkout.flutterwave.com/v3/hosted/pay/abc123xyz",
    "tx_ref": "VRH-1703001234567-ABCD1234",
    "amount": 1500,
    "currency": "KES"
  }
}
```

---

## 3. Get Request Details

**Endpoint:** `GET /api/requests/:id`

```bash
curl http://localhost:5000/api/requests/65a1b2c3d4e5f6789abcdef0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789abcdef0",
    "userId": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+254712345678"
    },
    "platform": "facebook",
    "description": "My Facebook account was hacked...",
    "hasEmailAccess": true,
    "status": "new",
    "tx_ref": "VRH-1703001234567-ABCD1234",
    "paymentStatus": "pending",
    "notes": [],
    "createdAt": "2024-01-19T10:30:00.000Z",
    "updatedAt": "2024-01-19T10:30:00.000Z"
  }
}
```

---

## 4. Send Chat Message

**Endpoint:** `POST /api/chat/send`

```bash
curl -X POST http://localhost:5000/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "message": "My Facebook is hacked",
    "context": {}
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "I'm sorry to hear your Facebook account was compromised. Let's recover it together. First, do you still have access to the email or phone number linked to your Facebook account?",
    "intent": "lost_account_facebook",
    "confidence": 0.95,
    "suggestions": [
      "Yes, I have email access",
      "No, my email was also hacked",
      "What if I don't have access?"
    ],
    "requiresPayment": false,
    "escalated": false
  }
}
```

---

## 5. Get Chat Session History

**Endpoint:** `GET /api/chat/session/:sessionId`

```bash
curl http://localhost:5000/api/chat/session/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789abcdef1",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "messages": [
      {
        "from": "user",
        "text": "My Facebook is hacked",
        "ts": "2024-01-19T10:35:00.000Z"
      },
      {
        "from": "bot",
        "text": "I'm sorry to hear...",
        "ts": "2024-01-19T10:35:01.000Z",
        "intent": "lost_account_facebook",
        "confidence": 0.95
      }
    ],
    "status": "active",
    "context": {},
    "createdAt": "2024-01-19T10:35:00.000Z"
  }
}
```

---

## Admin Endpoints (Authentication Required)

### 6. Admin Login

**Endpoint:** `POST /api/admin/login`

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vanillarecoveryhub.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWExYjJjM2Q0ZTVmNjc4OWFiY2RlZjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDMwMDEyMzQsImV4cCI6MTcwMzYwNjAzNH0.abc123xyz",
    "user": {
      "id": "65a1b2c3d4e5f6789abcdef0",
      "name": "Admin",
      "email": "admin@vanillarecoveryhub.com",
      "role": "admin"
    }
  }
}
```

**Save the token for subsequent requests!**

---

### 7. Get All Requests (Admin)

**Endpoint:** `GET /api/admin/requests`

```bash
curl http://localhost:5000/api/admin/requests?page=1&limit=20&status=new \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "_id": "65a1b2c3d4e5f6789abcdef0",
        "userId": {
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "+254712345678"
        },
        "platform": "facebook",
        "status": "new",
        "paymentStatus": "pending",
        "createdAt": "2024-01-19T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

---

### 8. Add Comment to Request (Admin)

**Endpoint:** `POST /api/admin/requests/:id/comment`

```bash
curl -X POST http://localhost:5000/api/admin/requests/65a1b2c3d4e5f6789abcdef0/comment \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Contacted user via email. Awaiting response with additional details."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6789abcdef0",
    "notes": [
      {
        "by": "65a1b2c3d4e5f6789abcdef2",
        "text": "Contacted user via email...",
        "at": "2024-01-19T11:00:00.000Z"
      }
    ]
  }
}
```

---

### 9. Update Request Status (Admin)

**Endpoint:** `PUT /api/admin/requests/:id/status`

```bash
curl -X PUT http://localhost:5000/api/admin/requests/65a1b2c3d4e5f6789abcdef0/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Status updated successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6789abcdef0",
    "status": "in_progress",
    "updatedAt": "2024-01-19T11:15:00.000Z"
  }
}
```

---

### 10. Get Dashboard Stats (Admin)

**Endpoint:** `GET /api/admin/dashboard/stats`

```bash
curl http://localhost:5000/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalRequests": 150,
      "pendingRequests": 25,
      "inProgressRequests": 40,
      "resolvedRequests": 75,
      "failedRequests": 10,
      "totalRevenue": 225000,
      "escalatedChats": 5
    },
    "platformStats": [
      { "_id": "facebook", "count": 60 },
      { "_id": "instagram", "count": 50 },
      { "_id": "gmail", "count": 40 }
    ],
    "paymentStats": [
      { "_id": "paid", "count": 120 },
      { "_id": "pending", "count": 25 },
      { "_id": "failed", "count": 5 }
    ],
    "recentRequests": [ /* ... */ ]
  }
}
```

---

## Testing with Postman

### Import Collection

1. Create new collection: "Vanilla Recovery Hub API"
2. Add environment variables:
   - `base_url`: `http://localhost:5000`
   - `admin_token`: `(set after login)`

3. Add requests from examples above
4. For admin endpoints, use `{{admin_token}}` in Authorization header

### Authentication Flow

1. Call `/api/admin/login`
2. Copy token from response
3. Set environment variable: `admin_token`
4. All admin requests will auto-include it

---

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 404 Not Found
```json
{
  "error": "Request not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 900
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

---

## WebSocket / Real-time (Future Enhancement)

Currently not implemented. For real-time chat updates, implement with Socket.io:

```javascript
// Future: Real-time chat
socket.emit('chat_message', { sessionId, message });
socket.on('bot_reply', (data) => { /* handle */ });
```

---

**Happy Testing! 🧪**
