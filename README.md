# Vanilla Recovery Hub

**Professional Account Recovery Platform** 🛡️

A full-stack web application that helps users recover hacked or locked social media and email accounts.

[![Status](https://img.shields.io/badge/status-ready%20for%20deployment-success)]()
[![License](https://img.shields.io/badge/license-proprietary-blue)]()
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)]()

---

## 🚀 Quick Start

### **⚡ First Time Setup (5 minutes)**

**Follow this guide:** [**RAILWAY_POSTGRES_SETUP.md**](./RAILWAY_POSTGRES_SETUP.md) 👈 **START HERE!**

You'll need:
1. **Railway** account (free $5 credit) - [Sign up](https://railway.app) - Database + Hosting in ONE place!
2. **Flutterwave** test keys (free) - [Sign up](https://flutterwave.com/ke/signup)
3. 5 minutes to configure

### **Already Configured?**

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 📚 **Documentation**

| Guide | Description |
|-------|-------------|
| **[RAILWAY_POSTGRES_SETUP.md](./RAILWAY_POSTGRES_SETUP.md)** | ⚡ **START HERE** - PostgreSQL on Railway (5 min) |
| **[QUICK_START.md](./QUICK_START.md)** | Development workflow guide |
| **[API_EXAMPLES.md](./API_EXAMPLES.md)** | cURL examples for testing |
| **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** | API reference & architecture |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Production deployment guide |
| **[SECURITY.md](./SECURITY.md)** | Security best practices |
| **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** | Complete project overview |
| **[CHANGELOG.md](./CHANGELOG.md)** | Version history |

---

## Tech Stack
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, deployed to Firebase Hosting
- **Backend**: Node.js + Express with TypeScript, deployed to Railway
- **Database**: PostgreSQL on Railway with Prisma ORM
- **Payments**: Flutterwave (primary payment gateway)
- **Email**: Resend API
- **Auth**: JWT-based authentication
- **Monitoring**: Winston logging

## Project Structure
```
├── frontend/          # Next.js frontend application
├── backend/           # Express.js API server
├── .gitignore
└── README.md
```

## Features (Phase 1 - MVP)
- ✅ Landing page with pricing tiers
- ✅ Recovery request submission form
- ✅ Flutterwave payment integration
- ✅ Trained chatbot with 100+ intents
- ✅ Admin dashboard with request management
- ✅ Email automation
- ✅ Payment webhook verification

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Flutterwave account (test & production keys)
- Firebase account
- Resend API account

### Environment Variables

#### Backend (.env in backend/)
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vanilla-recovery-hub
FLW_PUBLIC_KEY=FLWPUBK_TEST-xxxxx
FLW_SECRET_KEY=FLWSECK_TEST-xxxxx
FLW_ENCRYPTION_KEY=FLWSECK_TESTxxxxx
SUCCESS_URL=http://localhost:3000/payment-success
FAIL_URL=http://localhost:3000/payment-failed
JWT_SECRET=your-super-secret-jwt-key-change-in-production
EMAIL_API_KEY=re_xxxxx (Resend API key)
ADMIN_EMAIL=admin@vanillarecoveryhub.com
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

#### Frontend (.env.local in frontend/)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxxx
```

### Local Development

1. **Clone and install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. **Set up MongoDB Atlas**
- Create a cluster at mongodb.com
- Create a database named `vanilla-recovery-hub`
- Whitelist your IP (or 0.0.0.0/0 for development)
- Get connection string and add to backend/.env

3. **Configure Flutterwave**
- Sign up at flutterwave.com
- Get test API keys from Settings > API
- Add keys to backend/.env

4. **Configure Firebase (for admin auth)**
- Create project at console.firebase.google.com
- Enable Email/Password authentication
- Get config and add to frontend/.env.local
- Create an admin user in Firebase Console

5. **Start development servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

Visit http://localhost:3000 for frontend and http://localhost:5000 for API.

### Seeding the Database

The chatbot training data will be auto-seeded on first backend start. To manually seed:
```bash
cd backend
npm run seed
```

## API Endpoints

### Public Endpoints
- `POST /api/requests/create` - Create recovery request
- `POST /api/payments/initiate` - Initiate Flutterwave payment
- `POST /api/payments/webhook` - Handle Flutterwave webhooks
- `GET /api/requests/:id` - Get request details
- `POST /api/chat/send` - Send message to chatbot

### Admin Endpoints (requires auth token)
- `GET /api/admin/requests` - List all requests (paginated)
- `POST /api/admin/requests/:id/comment` - Add comment to request
- `PUT /api/admin/requests/:id/status` - Update request status
- `POST /api/admin/chat/reply` - Reply to user chat session
- `GET /api/admin/chat/sessions` - Get active chat sessions

## Deployment

### Backend to Railway
1. Create new project on railway.app
2. Connect your GitHub repo
3. Set all environment variables in Railway dashboard
4. Deploy from main branch
5. Note your Railway URL (e.g., https://vanilla-recovery-hub.railway.app)

### Frontend to Firebase
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `cd frontend && firebase init`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

### MongoDB Atlas Production
1. Update connection string to production cluster
2. Configure IP whitelist for Railway
3. Set up automated backups

### Flutterwave Production
1. Complete KYC verification
2. Switch to production API keys
3. Update webhook URL to production backend
4. Test with real KES transactions

## Security Checklist
- ✅ All API endpoints validate and sanitize input
- ✅ Payment webhooks verify signature with Flutterwave
- ✅ Admin endpoints protected with JWT authentication
- ✅ CORS restricted to frontend domain only
- ✅ Rate limiting on all public endpoints
- ✅ Never log or store passwords/credentials
- ✅ HTTPS enforced in production
- ✅ MongoDB connection uses SSL
- ✅ Environment variables never committed to Git

## Chatbot Training
The chatbot is trained on 100+ intents covering:
- Account recovery flows (Facebook, Instagram, Gmail, TikTok, YouTube)
- Payment questions and refund policy
- Security guidance (2FA, password managers)
- Privacy policy (never asks for passwords)
- Escalation to human support

To add new intents, update `backend/src/data/chatbot_training_seed.json` and restart the server.

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Payment Flow Test (Sandbox)
1. Create a test request
2. Initiate payment (use Flutterwave test cards)
3. Complete payment in sandbox
4. Verify webhook updates request status
5. Check email delivery

### Chatbot Test
Visit http://localhost:3000 and click the chat widget. Test utterances:
- "My Facebook is hacked"
- "How much does it cost?"
- "Do you need my password?"
- "I want to speak to a human"

## Support
For technical issues, contact: dev@vanillarecoveryhub.com
For user support: support@vanillarecoveryhub.com

## License
Proprietary - All rights reserved © 2024 Vanilla Recovery Hub

---

**Developer Notes:**
- Always verify payment webhooks - never trust the redirect alone
- Chatbot must NEVER accept or store user passwords
- Test all payment flows in sandbox before going live
- Keep dependencies updated for security patches
- Monitor Sentry for production errors
- Review chat logs weekly for new intent training opportunities
