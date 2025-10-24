# Developer Guide - Vanilla Recovery Hub

## Quick Start

### Backend (Local)
```bash
cd backend
npm install
cp .env.example .env  # Add your MongoDB URI and API keys
npm run dev  # Runs on http://localhost:5000
```

### Frontend (Local)
```bash
cd frontend
npm install
cp .env.local.example .env.local  # Add backend URL
npm run dev  # Runs on http://localhost:3000
```

## Key API Endpoints

### Public
- `POST /api/requests/create` - Submit recovery request
- `POST /api/payments/initiate` - Start payment
- `POST /api/payments/webhook` - Flutterwave webhook
- `POST /api/chat/send` - Send chatbot message
- `GET /api/requests/:id` - Get request details

### Admin (Auth Required)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/requests` - List all requests
- `POST /api/admin/requests/:id/comment` - Add note
- `GET /api/admin/dashboard/stats` - Dashboard stats

## Chatbot Training

Edit `backend/src/data/chatbot_training_seed.json`:
```json
{
  "name": "intent_name",
  "patterns": ["user says this", "or this"],
  "responses": ["bot replies this"],
  "tags": ["category"]
}
```

Restart backend to retrain.

## Payment Flow
1. User submits form → creates Request
2. Backend initiates Flutterwave payment
3. User pays on Flutterwave
4. Webhook updates DB (ALWAYS verify with Flutterwave API)
5. Email sent to user

## Database Models
- **users**: Customer & admin accounts
- **requests**: Recovery requests
- **payments**: Transaction records
- **chat_logs**: Chatbot conversations

## Security Notes
- Never log passwords
- Verify all webhook signatures
- Use HTTPS in production
- Restrict CORS to frontend domain
- Rate limit all endpoints

## Testing Payment
Use Flutterwave test card:
- Card: `5531886652142950`
- CVV: `564`
- Expiry: `09/32`
- PIN: `3310`
- OTP: `12345`
