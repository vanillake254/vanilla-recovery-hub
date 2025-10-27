# 🚀 Switch to Live Flutterwave Payments

## **📋 Complete Guide to Go Live**

---

## **Step 1: Get Your Live API Keys from Flutterwave**

### **1.1 Login to Flutterwave Dashboard**
```
https://dashboard.flutterwave.com/
```

### **1.2 Complete Business Verification (Required for Live Mode)**

**Documents Needed:**
- ✅ Business Registration Certificate (or Personal ID if sole proprietor)
- ✅ KRA PIN Certificate
- ✅ Bank Account Details
- ✅ Business Address Proof
- ✅ Director's ID/Passport

**How to Submit:**
1. Go to: Settings → Business Information
2. Fill in all business details
3. Upload required documents
4. Submit for verification
5. Wait 1-3 business days for approval

### **1.3 Get Your Live API Keys**

**Once Verified:**
1. Go to: **Settings → API Keys**
2. Switch to **"Live"** mode (toggle at top)
3. Copy these 3 keys:
   - ✅ **Public Key** (starts with `FLWPUBK-`)
   - ✅ **Secret Key** (starts with `FLWSECK-`)
   - ✅ **Encryption Key** (starts with `FLWSECK`)

---

## **Step 2: Update Backend Environment Variables**

### **2.1 Update Railway Environment Variables**

**Go to Railway Dashboard:**
```
https://railway.app/
→ Select your project
→ Backend service
→ Variables tab
```

**Replace These Variables:**
```bash
# OLD (Test Keys)
FLW_PUBLIC_KEY=FLWPUBK_TEST-18dc7be61d1fe50d649ee27ec6a23841-X
FLW_SECRET_KEY=FLWSECK_TEST-9928034dacd9b8ed5f30f7e7816aaead-X
FLW_ENCRYPTION_KEY=FLWSECK_TESTd8ae7cea4f33

# NEW (Your Live Keys from Flutterwave)
FLW_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLW_SECRET_KEY=FLWSECK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLW_ENCRYPTION_KEY=FLWSECKxxxxxxxxxxxxxxx
```

**Also Update URLs:**
```bash
# OLD (Localhost)
SUCCESS_URL=http://localhost:3000/payment-success
FAIL_URL=http://localhost:3000/payment-failed
FRONTEND_URL=http://localhost:3000

# NEW (Production)
SUCCESS_URL=https://vanillarecoveryhub.web.app/payment-success
FAIL_URL=https://vanillarecoveryhub.web.app/payment-failed
FRONTEND_URL=https://vanillarecoveryhub.web.app
```

**Set Environment to Production:**
```bash
NODE_ENV=production
```

### **2.2 Update Local .env File (for testing)**

**File:** `/backend/.env`

```bash
# PostgreSQL - Railway Database
DATABASE_URL=postgresql://postgres:iqSwbVJWaFbAfFOeyeudOjbfFaqHIeOX@yamabiko.proxy.rlwy.net:46931/railway

# Flutterwave LIVE Keys (Replace with your actual keys)
FLW_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLW_SECRET_KEY=FLWSECK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLW_ENCRYPTION_KEY=FLWSECKxxxxxxxxxxxxxxx

# Production URLs
SUCCESS_URL=https://vanillarecoveryhub.web.app/payment-success
FAIL_URL=https://vanillarecoveryhub.web.app/payment-failed
FRONTEND_URL=https://vanillarecoveryhub.web.app

# JWT Secret (Keep same)
JWT_SECRET=43db8162f329de9cdfb5ccd05cdbd8c8405f28fa8b5baafaf7dc95b7f5396278

# Email (Keep same)
EMAIL_API_KEY=re_XRaoGVwV_8tjUFW8LByTnyyBJpsRcE8K7
ADMIN_EMAIL=admin@vanillarecoveryhub.com

# Server
PORT=5000
NODE_ENV=production
```

---

## **Step 3: Update Frontend Environment Variables**

### **3.1 Update Firebase Hosting Environment**

**File:** `/frontend/.env.production`

Create or update this file:
```bash
# Backend API (Railway Production URL)
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app

# Flutterwave Live Public Key
NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### **3.2 Update .env.local (for local testing)**

**File:** `/frontend/.env.local`

```bash
# Backend API
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app

# Flutterwave Live Public Key
NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
```

---

## **Step 4: Configure Flutterwave Webhooks (Important!)**

### **4.1 Set Up Webhook URL**

**In Flutterwave Dashboard:**
1. Go to: **Settings → Webhooks**
2. Add webhook URL:
   ```
   https://your-backend.up.railway.app/api/payments/webhook
   ```
3. Select events to listen for:
   - ✅ `charge.completed`
   - ✅ `transfer.completed`
4. Copy the **Webhook Secret Hash**
5. Save

### **4.2 Add Webhook Secret to Environment**

**In Railway (Backend Variables):**
```bash
FLW_WEBHOOK_SECRET=your-webhook-secret-hash-here
```

---

## **Step 5: Test Live Payments**

### **5.1 Test with Real Card (Small Amount)**

**Use a real card with small amount (e.g., KES 10):**
1. Go to: https://vanillarecoveryhub.web.app/recover
2. Fill recovery form
3. Select Basic tier (KES 2,000) or test with custom amount
4. Use real card details
5. Complete payment
6. Verify:
   - ✅ Payment shows in Flutterwave dashboard
   - ✅ Webhook received
   - ✅ Database updated
   - ✅ Email sent

### **5.2 Test M-PESA (Kenya)**

**M-PESA is the most popular payment method in Kenya:**
1. Start payment flow
2. Select M-PESA as payment method
3. Enter M-PESA number
4. Complete STK push on phone
5. Verify payment

### **5.3 Test All Payment Methods**

Flutterwave supports:
- ✅ M-PESA (Kenya)
- ✅ Card (Visa, Mastercard)
- ✅ Bank Transfer
- ✅ Mobile Money (other countries)

---

## **Step 6: Update Payment Configuration**

### **6.1 Check Payment Service Configuration**

**File:** `/backend/src/services/paymentService.ts`

Ensure it uses environment variables:
```typescript
const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3';

// Uses environment variables (already configured)
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY;
const FLW_ENCRYPTION_KEY = process.env.FLW_ENCRYPTION_KEY;
```

**✅ No code changes needed!** Just update environment variables.

---

## **Step 7: Deploy Changes**

### **7.1 Deploy Backend to Railway**

```bash
cd backend
git add .
git commit -m "Switch to live Flutterwave payments"
git push origin main

# Railway auto-deploys
# Or manually:
railway up
```

### **7.2 Deploy Frontend to Firebase**

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

---

## **Step 8: Security Checklist**

### **8.1 Verify Security Settings**

**✅ Checklist:**
- [ ] Live API keys are in environment variables (not in code)
- [ ] `.env` files are in `.gitignore`
- [ ] Webhook secret is configured
- [ ] HTTPS is enabled (Firebase Hosting = automatic)
- [ ] CORS is configured for production domain
- [ ] Rate limiting is enabled
- [ ] Payment verification is server-side

### **8.2 Enable Flutterwave Security Features**

**In Flutterwave Dashboard:**
1. **Settings → Security**
2. Enable:
   - ✅ 3D Secure (for card payments)
   - ✅ IP Whitelisting (optional)
   - ✅ Webhook signature verification
3. Set allowed domains:
   - `vanillarecoveryhub.web.app`
   - `your-backend.up.railway.app`

---

## **Step 9: Monitor Live Transactions**

### **9.1 Flutterwave Dashboard**

**Monitor:**
- ✅ Transactions (real-time)
- ✅ Success rate
- ✅ Failed payments
- ✅ Chargebacks
- ✅ Settlement reports

### **9.2 Your Admin Dashboard**

**Monitor:**
- ✅ Payment status in database
- ✅ Webhook logs
- ✅ Email notifications
- ✅ Recovery requests

---

## **Step 10: Settlement & Payouts**

### **10.1 Configure Settlement Account**

**In Flutterwave Dashboard:**
1. Go to: **Settings → Settlement**
2. Add bank account details:
   - Bank name
   - Account number
   - Account name
3. Choose settlement frequency:
   - Daily (recommended)
   - Weekly
   - Monthly

### **10.2 Withdrawal**

**Funds are automatically settled to your bank account:**
- ✅ T+1 settlement (next business day)
- ✅ Automatic or manual withdrawal
- ✅ Check balance in dashboard

---

## **📊 Quick Reference**

### **Environment Variables to Update:**

| Variable | Test Value | Live Value |
|----------|-----------|------------|
| `FLW_PUBLIC_KEY` | `FLWPUBK_TEST-...` | `FLWPUBK-...` |
| `FLW_SECRET_KEY` | `FLWSECK_TEST-...` | `FLWSECK-...` |
| `FLW_ENCRYPTION_KEY` | `FLWSECK_TEST...` | `FLWSECK...` |
| `SUCCESS_URL` | `localhost:3000/...` | `vanillarecoveryhub.web.app/...` |
| `FAIL_URL` | `localhost:3000/...` | `vanillarecoveryhub.web.app/...` |
| `FRONTEND_URL` | `localhost:3000` | `vanillarecoveryhub.web.app` |
| `NODE_ENV` | `development` | `production` |

---

## **🚨 Important Notes**

### **Before Going Live:**
1. ✅ **Complete Flutterwave KYC** (business verification)
2. ✅ **Test with small amounts first**
3. ✅ **Set up webhooks properly**
4. ✅ **Configure settlement account**
5. ✅ **Enable 3D Secure for cards**
6. ✅ **Monitor first few transactions closely**

### **Flutterwave Fees (Kenya):**
- **M-PESA:** 1.4% + KES 1
- **Cards:** 2.9% + KES 10
- **Bank Transfer:** 1.4%

### **Settlement Time:**
- **M-PESA:** T+1 (next business day)
- **Cards:** T+1
- **Bank Transfer:** T+1

---

## **✅ Verification Checklist**

After going live, verify:

- [ ] Live API keys added to Railway
- [ ] Live API keys added to Firebase (frontend)
- [ ] Production URLs updated
- [ ] Webhook configured and working
- [ ] Test payment successful (small amount)
- [ ] Payment appears in Flutterwave dashboard
- [ ] Database updated correctly
- [ ] Email notifications sent
- [ ] Settlement account configured
- [ ] Security features enabled
- [ ] Monitoring set up

---

## **🆘 Troubleshooting**

### **Payment Fails:**
1. Check API keys are correct (live, not test)
2. Verify webhook is receiving events
3. Check Flutterwave dashboard for error messages
4. Ensure 3D Secure is enabled for cards

### **Webhook Not Working:**
1. Verify webhook URL is correct
2. Check webhook secret is configured
3. Test webhook manually in Flutterwave dashboard
4. Check backend logs for errors

### **Settlement Issues:**
1. Verify bank account details
2. Check KYC status (must be approved)
3. Ensure minimum balance met
4. Contact Flutterwave support

---

## **📞 Support**

### **Flutterwave Support:**
- Email: support@flutterwavego.com
- Phone: +234 1 888 3666
- Live Chat: dashboard.flutterwave.com

### **Documentation:**
- API Docs: https://developer.flutterwave.com/docs
- Integration Guide: https://developer.flutterwave.com/docs/integration-guides

---

## **🎉 You're Ready to Go Live!**

Follow these steps carefully and you'll be accepting real payments in no time!

**Remember:** Start with small test transactions before processing large amounts.
