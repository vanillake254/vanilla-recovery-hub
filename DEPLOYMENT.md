# Deployment Guide - Vanilla Recovery Hub

## Prerequisites

Before deploying, ensure you have:
- MongoDB Atlas account (free tier is fine for MVP)
- Flutterwave account with API keys
- Firebase account for hosting & auth
- Railway account for backend hosting
- Resend account for email services
- Domain name (optional but recommended)

---

## Part 1: MongoDB Atlas Setup

### 1. Create MongoDB Cluster

1. Go to [mongodb.com](https://mongodb.com) and sign up/login
2. Click **"Build a Database"**
3. Choose **"Shared"** (Free tier)
4. Select your region (closest to Kenya - e.g., Frankfurt or Mumbai)
5. Name your cluster: `vanilla-recovery-hub`
6. Click **"Create"**

### 2. Configure Database Access

1. Go to **Database Access** → **Add New Database User**
2. Create username and strong password
3. Select **"Read and write to any database"**
4. Click **"Add User"**

### 3. Configure Network Access

1. Go to **Network Access** → **Add IP Address**
2. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
3. For production: Add your Railway IP ranges (get from Railway dashboard)
4. Click **"Confirm"**

### 4. Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@...`)
4. Replace `<username>` and `<password>` with your credentials
5. Add database name: `mongodb+srv://user:pass@cluster.mongodb.net/vanilla-recovery-hub`

---

## Part 2: Flutterwave Setup

### 1. Create Flutterwave Account

1. Go to [flutterwave.com](https://flutterwave.com)
2. Sign up and complete KYC verification
3. Go to **Settings** → **API**

### 2. Get API Keys

**For Testing:**
- Public Key: `FLWPUBK_TEST-xxxxx`
- Secret Key: `FLWSECK_TEST-xxxxx`
- Encryption Key: `FLWSECK_TESTxxxxx`

**For Production:**
- Complete full KYC
- Get live API keys from the same section

### 3. Configure Webhooks

1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://your-railway-backend.railway.app/api/payments/webhook`
3. Secret Hash will be your `FLW_SECRET_KEY`
4. Enable events: `charge.completed`

---

## Part 3: Backend Deployment to Railway

### 1. Prepare Backend

```bash
cd backend
npm install
npm run build  # Test build locally
```

### 2. Deploy to Railway

**Option A: Using Railway CLI**
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

**Option B: Using GitHub (Recommended)**
1. Push your code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Choose `backend` as the root directory

### 3. Configure Environment Variables in Railway

Go to your Railway project → **Variables** and add:

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/vanilla-recovery-hub
FLW_PUBLIC_KEY=FLWPUBK_TEST-xxxxx
FLW_SECRET_KEY=FLWSECK_TEST-xxxxx
FLW_ENCRYPTION_KEY=FLWSECK_TESTxxxxx
SUCCESS_URL=https://your-firebase-app.web.app/payment-success
FAIL_URL=https://your-firebase-app.web.app/payment-failed
JWT_SECRET=generate-a-strong-random-32-character-string
EMAIL_API_KEY=re_xxxxx
ADMIN_EMAIL=admin@vanillarecoveryhub.com
FRONTEND_URL=https://your-firebase-app.web.app
PORT=5000
NODE_ENV=production
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Get Railway Backend URL

After deployment, Railway will provide a URL like:
`https://vanilla-recovery-hub.railway.app`

Save this - you'll need it for frontend configuration.

---

## Part 4: Firebase Setup

### 1. Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Name: `vanilla-recovery-hub`
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### 2. Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Click **"Save"**

### 3. Create Admin User

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Email: `admin@vanillarecoveryhub.com`
4. Password: Create a strong password
5. Click **"Add user"**

### 4. Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** → Click web icon `</>`
3. Register app: `Vanilla Recovery Hub Frontend`
4. Copy the config object

### 5. Enable Hosting

```bash
npm install -g firebase-tools
firebase login
cd frontend
firebase init hosting
```

Select:
- Use existing project: `vanilla-recovery-hub`
- Public directory: `out`
- Single-page app: `Yes`
- GitHub integration: `No` (optional)

---

## Part 5: Frontend Deployment

### 1. Configure Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### 2. Build and Deploy

```bash
cd frontend
npm install
npm run build  # Creates 'out' directory
firebase deploy --only hosting
```

### 3. Get Your Live URL

Firebase will output:
```
✔  Deploy complete!
Hosting URL: https://vanilla-recovery-hub.web.app
```

---

## Part 6: Resend Email Setup

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up and verify email
3. Go to **API Keys** → **Create API Key**
4. Copy the key (starts with `re_`)

### 2. Add Domain (Optional but Recommended)

1. Go to **Domains** → **Add Domain**
2. Add your domain: `vanillarecoveryhub.com`
3. Add DNS records provided by Resend
4. Verify domain

### 3. Update Backend ENV

Add to Railway variables:
```env
EMAIL_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
ADMIN_EMAIL=noreply@vanillarecoveryhub.com
```

---

## Part 7: Final Configuration

### 1. Update Flutterwave Webhook

Now that you have your Railway URL, update Flutterwave webhook:
1. Go to Flutterwave Settings → Webhooks
2. URL: `https://your-railway-backend.railway.app/api/payments/webhook`
3. Save

### 2. Update Success/Fail URLs in Railway

```env
SUCCESS_URL=https://vanilla-recovery-hub.web.app/payment-success
FAIL_URL=https://vanilla-recovery-hub.web.app/payment-failed
```

### 3. Update Frontend API URL

Ensure frontend `.env.local` has:
```env
NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app
```

Rebuild and redeploy:
```bash
npm run build
firebase deploy --only hosting
```

---

## Part 8: Testing

### 1. Test Payment Flow (Sandbox)

1. Go to your live site
2. Click **"Start Recovery"**
3. Fill form and submit
4. Use Flutterwave test cards:
   - **Successful:** Card: `5531886652142950`, CVV: `564`, Expiry: `09/32`, PIN: `3310`, OTP: `12345`
   - **Failed:** Card: `5143010522339965`, CVV: `276`, Expiry: `09/27`, PIN: `3310`

### 2. Test Chatbot

1. Click chat widget on homepage
2. Try utterances:
   - "My Facebook is hacked"
   - "Do you need my password?"
   - "How much does it cost?"
   - "I need human help"

### 3. Test Admin Dashboard

1. Go to `https://your-site.web.app/admin/login`
2. Login with admin credentials
3. Verify dashboard loads with stats
4. Check requests list

### 4. Test Email

1. Complete a test payment
2. Check inbox for confirmation email
3. Verify all links work

---

## Part 9: Go Live (Production)

### 1. Complete Flutterwave KYC

1. Submit business documents
2. Wait for approval (1-3 days)
3. Get live API keys

### 2. Update Railway with Live Keys

Replace test keys with live keys:
```env
FLW_PUBLIC_KEY=FLWPUBK-xxxxx
FLW_SECRET_KEY=FLWSECK-xxxxx
FLW_ENCRYPTION_KEY=FLWSECKxxxxx
```

### 3. Secure MongoDB

1. Remove "0.0.0.0/0" from Network Access
2. Add specific Railway IP ranges
3. Enable SSL

### 4. Enable Production Mode

```env
NODE_ENV=production
```

### 5. Set Up Monitoring

**Railway:**
- Enable automatic deploys from main branch
- Set up health checks
- Enable logging

**Sentry (Optional):**
```bash
npm install @sentry/node
```
Add SENTRY_DSN to Railway env vars

---

## Part 10: Custom Domain (Optional)

### 1. Firebase Custom Domain

1. Go to Firebase Console → Hosting
2. Click **"Add custom domain"**
3. Enter your domain: `vanillarecoveryhub.com`
4. Add DNS records to your domain provider
5. Wait for verification (can take 24-48 hours)

### 2. Railway Custom Domain

1. Go to Railway project → Settings
2. Add custom domain for API: `api.vanillarecoveryhub.com`
3. Add DNS record (CNAME) to your domain provider

### 3. Update All URLs

After custom domains are active, update:
- Railway: `FRONTEND_URL=https://vanillarecoveryhub.com`
- Frontend: `NEXT_PUBLIC_API_URL=https://api.vanillarecoveryhub.com`
- Flutterwave: Update webhook and redirect URLs

---

## Troubleshooting

### Backend Not Starting
- Check Railway logs: `railway logs`
- Verify all env vars are set
- Test MongoDB connection string locally

### Payment Webhook Not Working
- Verify webhook URL in Flutterwave
- Check Railway logs for incoming webhooks
- Test webhook with Flutterwave dashboard test tool

### Frontend Not Loading
- Clear browser cache
- Check browser console for errors
- Verify API_URL is correct
- Check CORS settings in backend

### Email Not Sending
- Verify Resend API key
- Check domain verification
- Look for errors in Railway logs

### Chatbot Not Responding
- Check backend logs
- Verify chatbot initialized on server start
- Test API endpoint directly: `curl https://api-url/api/chat/send`

---

## Security Checklist

- ✅ All environment variables stored securely (not in code)
- ✅ MongoDB network access restricted
- ✅ HTTPS enabled everywhere
- ✅ CORS restricted to frontend domain only
- ✅ JWT secret is strong and random
- ✅ Rate limiting enabled
- ✅ Webhook signatures verified
- ✅ Admin endpoints protected
- ✅ No passwords in logs
- ✅ SSL certificates valid

---

## Maintenance

### Daily
- Check Railway logs for errors
- Monitor Flutterwave transactions
- Review escalated chat sessions

### Weekly
- Review and respond to all support requests
- Check payment reconciliation
- Update chatbot responses based on common questions

### Monthly
- Review and optimize MongoDB queries
- Check hosting costs (Railway, Firebase)
- Security audit and dependency updates

---

## Support Contacts

- **Railway:** support@railway.app
- **Firebase:** firebase.google.com/support
- **Flutterwave:** hi@flutterwavego.com
- **MongoDB:** support.mongodb.com

---

**Deployment Complete! 🎉**

Your Vanilla Recovery Hub is now live and ready to help users recover their accounts!

Live URLs:
- Frontend: `https://vanilla-recovery-hub.web.app`
- Backend: `https://your-app.railway.app`
- Admin: `https://vanilla-recovery-hub.web.app/admin`
