# 🚀 Complete Backend Setup Guide

Follow these steps to get your backend fully operational with all required services.

---

## 📋 **Step 1: MongoDB Atlas Setup (5 minutes)**

### **1.1 Create Account & Cluster**
1. Visit: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with Google/GitHub or email
3. Choose **FREE M0 Cluster** (512MB storage, perfect for development)
4. Select:
   - **Provider:** AWS
   - **Region:** Choose closest to Kenya (e.g., `eu-west-1` Ireland or `ap-south-1` Mumbai)
   - **Cluster Name:** `vanilla-recovery-hub`
5. Click **Create Cluster** (takes 1-3 minutes)

### **1.2 Configure Database Access**
1. In left sidebar, click **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Set:
   - **Username:** `vanilla_admin`
   - **Password:** Click "Autogenerate Secure Password" (copy it!)
   - **Database User Privileges:** Select "Read and write to any database"
5. Click **Add User**

### **1.3 Configure Network Access**
1. In left sidebar, click **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
   - This adds `0.0.0.0/0` to whitelist
4. Click **Confirm**

### **1.4 Get Connection String**
1. Go back to **Database** (left sidebar)
2. Click **Connect** button on your cluster
3. Choose **Connect your application**
4. Select:
   - **Driver:** Node.js
   - **Version:** 5.5 or later
5. Copy the connection string (looks like):
   ```
   mongodb+srv://vanilla_admin:<password>@vanilla-recovery-hub.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace `<password>`** with the password you copied earlier
7. **Add database name** before the `?`:
   ```
   mongodb+srv://vanilla_admin:YOUR_PASSWORD@vanilla-recovery-hub.xxxxx.mongodb.net/vanilla-recovery-hub?retryWrites=true&w=majority
   ```

---

## 💳 **Step 2: Flutterwave Test Keys Setup (3 minutes)**

### **2.1 Create Account**
1. Visit: **https://flutterwave.com/ke/signup**
2. Sign up with your email
3. Verify your email address
4. Complete basic profile setup

### **2.2 Get Test API Keys**
1. After login, go to **Settings** (gear icon in sidebar)
2. Click **API Keys** or **API** tab
3. You'll see **Test Keys** section with:
   - **Public Key** (starts with `FLWPUBK_TEST-`)
   - **Secret Key** (starts with `FLWSECK_TEST-`)
   - **Encryption Key** (starts with `FLWSECK_TEST`)
4. Copy all three keys

### **2.3 Test Mode**
- You're automatically in **Test Mode** (toggle at top)
- Test mode uses fake cards for testing payments
- No real money is charged in test mode

### **Test Card Details (for testing payments):**
```
Card Number: 5531886652142950
CVV: 564
Expiry: 09/32
PIN: 3310
OTP: 12345
```

---

## 📧 **Step 3: Resend Email API (2 minutes) - OPTIONAL**

### **3.1 Create Account**
1. Visit: **https://resend.com/signup**
2. Sign up with GitHub or email
3. Verify your email

### **3.2 Get API Key**
1. After login, go to **API Keys**
2. Click **Create API Key**
3. Name it: `Vanilla Recovery Hub Dev`
4. Copy the key (starts with `re_`)

### **3.3 Add Sending Domain (Optional)**
- Free tier allows 100 emails/day from `onboarding@resend.dev`
- For custom domain, add your domain in **Domains** section

**Note:** Email is optional for initial testing. The app will work without it, but won't send notifications.

---

## ⚙️ **Step 4: Configure Backend .env**

Open `/home/vanilla-ke/development/VANILLA RECOVERY HUB/backend/.env` and update:

```bash
# MongoDB - Paste your connection string from Step 1.4
MONGO_URI=mongodb+srv://vanilla_admin:YOUR_PASSWORD@vanilla-recovery-hub.xxxxx.mongodb.net/vanilla-recovery-hub?retryWrites=true&w=majority

# Flutterwave Test Keys - Paste from Step 2.2
FLW_PUBLIC_KEY=FLWPUBK_TEST-your-actual-key-here
FLW_SECRET_KEY=FLWSECK_TEST-your-actual-key-here
FLW_ENCRYPTION_KEY=FLWSECK_TEST-your-actual-key-here

# URLs (keep as is for local development)
SUCCESS_URL=http://localhost:3000/payment-success
FAIL_URL=http://localhost:3000/payment-failed
FRONTEND_URL=http://localhost:3000

# JWT Secret (already generated - keep this)
JWT_SECRET=43db8162f329de9cdfb5ccd05cdbd8c8405f28fa8b5baafaf7dc95b7f5396278

# Email (Resend API - paste from Step 3.2, or leave as is to skip emails)
EMAIL_API_KEY=re_your-actual-key-here
ADMIN_EMAIL=admin@vanillarecoveryhub.com

# Server (keep as is)
PORT=5000
NODE_ENV=development
```

---

## 🧪 **Step 5: Test Backend**

### **5.1 Start Backend Server**
```bash
cd /home/vanilla-ke/development/VANILLA\ RECOVERY\ HUB/backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### **5.2 Test Health Endpoint**
Open new terminal:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-24T10:48:00.000Z",
  "uptime": 5.123,
  "database": "connected"
}
```

### **5.3 Test Chatbot**
```bash
curl -X POST http://localhost:5000/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "sessionId": "test-123"}'
```

Expected response:
```json
{
  "response": "Hello! 👋 Welcome to Vanilla Recovery Hub...",
  "escalate": false
}
```

---

## 🎯 **Step 6: Test Full Application**

### **6.1 Start Frontend**
In another terminal:
```bash
cd /home/vanilla-ke/development/VANILLA\ RECOVERY\ HUB/frontend
npm run dev
```

### **6.2 Test Complete Flow**
1. **Open:** http://localhost:3000
2. **Click:** "Start Recovery" button
3. **Fill form:**
   - Name: Test User
   - Email: test@example.com
   - Phone: +254712345678
   - Platform: Instagram
   - Account: @testaccount
   - Issue: Hacked account
   - Tier: Basic (KES 1,500)
4. **Submit form** → Should redirect to Flutterwave payment page
5. **Use test card** (from Step 2.3)
6. **Complete payment** → Should redirect to success page
7. **Test chatbot** (bottom-right icon)

### **6.3 Test Admin Dashboard**
1. **Open:** http://localhost:3000/admin/login
2. **Login with:**
   - Email: `admin@vanillarecoveryhub.com`
   - Password: `admin123` (default - change in production!)
3. **View dashboard** with statistics and requests

---

## ✅ **Verification Checklist**

- [ ] MongoDB Atlas cluster created and connection string obtained
- [ ] Flutterwave test keys obtained
- [ ] Resend API key obtained (optional)
- [ ] Backend `.env` file updated with all keys
- [ ] Backend server starts without errors
- [ ] Health endpoint returns `database: connected`
- [ ] Chatbot responds to test message
- [ ] Frontend loads successfully
- [ ] Recovery form submits and redirects to payment
- [ ] Payment flow works with test card
- [ ] Admin dashboard accessible

---

## 🆘 **Troubleshooting**

### **MongoDB Connection Error**
```
Error: connect ECONNREFUSED
```
**Solution:**
- Check connection string format
- Ensure password doesn't contain special characters (URL encode if needed)
- Verify IP whitelist includes `0.0.0.0/0`
- Wait 1-2 minutes after creating cluster

### **Flutterwave Payment Fails**
```
Error: Invalid API keys
```
**Solution:**
- Ensure you're using **TEST** keys (not live keys)
- Check keys are copied completely (no extra spaces)
- Verify you're in Test Mode in Flutterwave dashboard

### **Email Sending Fails**
```
Error: Invalid API key
```
**Solution:**
- This is non-critical - app works without emails
- Verify Resend API key format (starts with `re_`)
- Check free tier limits (100 emails/day)

---

## 🎉 **Next Steps**

Once everything is working:

1. **Test all features** thoroughly
2. **Review** `API_EXAMPLES.md` for more API tests
3. **Read** `DEPLOYMENT.md` when ready to deploy to production
4. **Update** admin password in production
5. **Switch** to Flutterwave live keys for production

---

## 📞 **Need Help?**

- **MongoDB Docs:** https://docs.atlas.mongodb.com/
- **Flutterwave Docs:** https://developer.flutterwave.com/docs
- **Resend Docs:** https://resend.com/docs

---

**Good luck! 🚀**
