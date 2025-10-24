# ⚡ Quick Setup - Get Running in 10 Minutes

## 🎯 **What You Need**

1. **MongoDB Atlas** (Free) - Database
2. **Flutterwave** (Free Test Mode) - Payments  
3. **Resend** (Optional) - Emails

---

## 📝 **Step-by-Step**

### **1️⃣ MongoDB Atlas (3 min)**

```bash
# Open in browser:
https://www.mongodb.com/cloud/atlas/register

# Steps:
1. Sign up (use Google for faster signup)
2. Create FREE cluster (M0)
3. Create database user:
   - Username: vanilla_admin
   - Password: (autogenerate and SAVE IT)
4. Network Access: "Allow from Anywhere"
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the string
   - Replace <password> with your saved password
   - Add database name: /vanilla-recovery-hub before the ?
```

**Your connection string should look like:**
```
mongodb+srv://vanilla_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/vanilla-recovery-hub?retryWrites=true&w=majority
```

---

### **2️⃣ Flutterwave Test Keys (2 min)**

```bash
# Open in browser:
https://flutterwave.com/ke/signup

# Steps:
1. Sign up with email
2. Verify email
3. Go to Settings → API Keys
4. Copy all 3 TEST keys:
   - Public Key (FLWPUBK_TEST-...)
   - Secret Key (FLWSECK_TEST-...)
   - Encryption Key (FLWSECK_TEST...)
```

---

### **3️⃣ Configure Backend (1 min)**

Open: `/home/vanilla-ke/development/VANILLA RECOVERY HUB/backend/.env`

**Update these lines:**

```bash
# Paste your MongoDB connection string
MONGO_URI=mongodb+srv://vanilla_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/vanilla-recovery-hub?retryWrites=true&w=majority

# Paste your Flutterwave test keys
FLW_PUBLIC_KEY=FLWPUBK_TEST-your-actual-key
FLW_SECRET_KEY=FLWSECK_TEST-your-actual-key
FLW_ENCRYPTION_KEY=FLWSECK_TEST-your-actual-key
```

**Keep everything else as is!**

---

### **4️⃣ Verify Setup (30 sec)**

```bash
cd /home/vanilla-ke/development/VANILLA\ RECOVERY\ HUB/backend
node verify-setup.js
```

You should see: **🎉 All checks passed!**

---

### **5️⃣ Start Servers (1 min)**

**Terminal 1 - Backend:**
```bash
cd /home/vanilla-ke/development/VANILLA\ RECOVERY\ HUB/backend
npm run dev
```

Wait for: **✅ MongoDB connected successfully**

**Terminal 2 - Frontend:**
```bash
cd /home/vanilla-ke/development/VANILLA\ RECOVERY\ HUB/frontend
npm run dev
```

---

## ✅ **Test It Works**

### **Quick Test:**
```bash
# In a new terminal:
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "database": "connected"
}
```

### **Full Test:**
1. Open: **http://localhost:3000**
2. Click: **"Start Recovery"**
3. Fill the form and submit
4. Should redirect to Flutterwave payment page ✅

---

## 🧪 **Test Payment (Use These Details)**

When you reach the payment page, use this **test card**:

```
Card Number: 5531 8866 5214 2950
CVV: 564
Expiry: 09/32
PIN: 3310
OTP: 12345
```

✅ Payment should succeed and redirect to success page!

---

## 🆘 **Troubleshooting**

### **Backend won't start?**
```bash
# Check your .env file:
cat backend/.env

# Run verification:
node backend/verify-setup.js
```

### **MongoDB connection error?**
- Wait 2 minutes after creating cluster
- Check password has no special characters
- Verify IP whitelist: `0.0.0.0/0`

### **Payment fails?**
- Ensure you're using **TEST** keys (not live)
- Check you're in Test Mode in Flutterwave dashboard
- Use the test card details above

---

## 📚 **Full Documentation**

- **Detailed Setup:** `SETUP_GUIDE.md`
- **API Testing:** `API_EXAMPLES.md`
- **Deployment:** `DEPLOYMENT.md`
- **Development:** `DEVELOPER_GUIDE.md`

---

## 🎉 **You're Done!**

Your app is now fully functional:

- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:5000
- ✅ Admin: http://localhost:3000/admin/login
  - Email: `admin@vanillarecoveryhub.com`
  - Password: `admin123`

**Happy coding! 🚀**
