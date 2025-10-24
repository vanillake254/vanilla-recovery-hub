# Quick Start Guide - Vanilla Recovery Hub

Get your development environment running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Flutterwave test account

## Step 1: Clone & Install (2 min)

```bash
cd "VANILLA RECOVERY HUB"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 2: Configure Backend (2 min)

Create `backend/.env`:

```env
# MongoDB (get from mongodb.com)
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/vanilla-recovery-hub

# Flutterwave Test Keys (get from flutterwave.com dashboard)
FLW_PUBLIC_KEY=FLWPUBK_TEST-xxxxx
FLW_SECRET_KEY=FLWSECK_TEST-xxxxx
FLW_ENCRYPTION_KEY=FLWSECK_TESTxxxxx

# URLs
SUCCESS_URL=http://localhost:3000/payment-success
FAIL_URL=http://localhost:3000/payment-failed
FRONTEND_URL=http://localhost:3000

# Generate random string for JWT
JWT_SECRET=your-random-32-character-secret-string

# Email (optional for testing - use any value)
EMAIL_API_KEY=re_test_key
ADMIN_EMAIL=admin@test.com

# Server
PORT=5000
NODE_ENV=development
```

**Get MongoDB URI:**
1. Go to mongodb.com → Create free cluster
2. Database Access → Add user
3. Network Access → Allow all (0.0.0.0/0)
4. Connect → Get connection string

**Get Flutterwave Keys:**
1. flutterwave.com → Sign up
2. Settings → API → Copy test keys

## Step 3: Configure Frontend (1 min)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Firebase config not needed for local testing.

## Step 4: Start Servers (30 sec)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Wait for: `✅ MongoDB Connected` and `🚀 Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 5: Test It! (1 min)

1. Open http://localhost:3000
2. Click **"Start Recovery"**
3. Fill the form and submit
4. Use Flutterwave test card:
   - Card: `5531886652142950`
   - CVV: `564`
   - Expiry: `09/32`
   - PIN: `3310`
   - OTP: `12345`

## Test Chatbot

Click the chat icon (bottom right) and try:
- "My Facebook is hacked"
- "How much does it cost?"
- "Do you need my password?"

## Admin Dashboard

1. Go to http://localhost:3000/admin/login
2. Email: `admin@vanillarecoveryhub.com`
3. Password: `admin123`

## Troubleshooting

**Backend won't start:**
- Check MongoDB URI is correct
- Verify Node.js version: `node --version` (should be 18+)

**Frontend shows connection error:**
- Make sure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

**Payment doesn't work:**
- Use exact test card numbers from Flutterwave
- Check Flutterwave test keys in backend `.env`

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to production
- Check [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for API details
- Customize chatbot responses in `backend/src/data/chatbot_training_seed.json`

---

**You're ready to develop! 🚀**

Backend: http://localhost:5000
Frontend: http://localhost:3000
Admin: http://localhost:3000/admin
