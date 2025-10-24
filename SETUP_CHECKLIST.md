# ✅ Setup Progress Checklist

Track your setup progress here. Mark items as you complete them!

---

## 📋 **Setup Tasks**

### **Phase 1: Account Creation**

- [ ] **MongoDB Atlas**
  - [ ] Created account at https://www.mongodb.com/cloud/atlas/register
  - [ ] Created free M0 cluster
  - [ ] Created database user (`vanilla_admin`)
  - [ ] Saved password securely
  - [ ] Configured network access (0.0.0.0/0)
  - [ ] Obtained connection string
  - [ ] Replaced `<password>` in connection string
  - [ ] Added database name `/vanilla-recovery-hub`

- [ ] **Flutterwave**
  - [ ] Created account at https://flutterwave.com/ke/signup
  - [ ] Verified email address
  - [ ] Navigated to Settings → API Keys
  - [ ] Copied Public Key (FLWPUBK_TEST-...)
  - [ ] Copied Secret Key (FLWSECK_TEST-...)
  - [ ] Copied Encryption Key (FLWSECK_TEST...)
  - [ ] Confirmed in TEST mode

- [ ] **Resend (Optional)**
  - [ ] Created account at https://resend.com/signup
  - [ ] Created API key
  - [ ] Copied API key (re_...)
  - [ ] *(Skip if not using email features)*

---

### **Phase 2: Configuration**

- [ ] **Backend .env File**
  - [ ] Opened `/backend/.env` file
  - [ ] Updated `MONGO_URI` with connection string
  - [ ] Updated `FLW_PUBLIC_KEY` with Flutterwave key
  - [ ] Updated `FLW_SECRET_KEY` with Flutterwave key
  - [ ] Updated `FLW_ENCRYPTION_KEY` with Flutterwave key
  - [ ] Updated `EMAIL_API_KEY` (or left as is)
  - [ ] Verified `JWT_SECRET` is set (auto-generated)
  - [ ] Saved file

- [ ] **Verification**
  - [ ] Ran `node backend/verify-setup.js`
  - [ ] All checks passed ✅
  - [ ] No errors in output

---

### **Phase 3: Testing**

- [ ] **Backend Server**
  - [ ] Started backend: `cd backend && npm run dev`
  - [ ] Saw "✅ MongoDB connected successfully"
  - [ ] Saw "🚀 Server running on port 5000"
  - [ ] No errors in console
  - [ ] Tested health endpoint: `curl http://localhost:5000/health`
  - [ ] Got response: `{"status":"ok","database":"connected"}`

- [ ] **Frontend Server**
  - [ ] Started frontend: `cd frontend && npm run dev`
  - [ ] Saw "Ready in X seconds"
  - [ ] No errors in console
  - [ ] Opened http://localhost:3000 in browser
  - [ ] Page loaded successfully

---

### **Phase 4: Feature Testing**

- [ ] **Landing Page**
  - [ ] Hero section displays correctly
  - [ ] "Start Recovery" button works
  - [ ] Pricing section shows KES 1,500 and KES 3,000
  - [ ] FAQ accordion opens/closes
  - [ ] Footer links present

- [ ] **Recovery Form**
  - [ ] Navigated to http://localhost:3000/recover
  - [ ] Form displays all fields
  - [ ] Filled out test form:
    - Name: Test User
    - Email: test@example.com
    - Phone: +254712345678
    - Platform: Instagram
    - Account: @testaccount
    - Issue: Hacked account
    - Tier: Basic
  - [ ] Clicked "Submit Request"
  - [ ] Redirected to Flutterwave payment page

- [ ] **Payment Flow**
  - [ ] Used test card:
    - Card: 5531 8866 5214 2950
    - CVV: 564
    - Expiry: 09/32
    - PIN: 3310
    - OTP: 12345
  - [ ] Payment processed successfully
  - [ ] Redirected to success page
  - [ ] Success page shows request ID

- [ ] **Chatbot**
  - [ ] Clicked chatbot icon (bottom-right)
  - [ ] Chatbot window opened
  - [ ] Sent test message: "Hello"
  - [ ] Received response from bot
  - [ ] Bot provides helpful information

- [ ] **Admin Dashboard**
  - [ ] Navigated to http://localhost:3000/admin/login
  - [ ] Logged in with:
    - Email: admin@vanillarecoveryhub.com
    - Password: admin123
  - [ ] Dashboard loaded successfully
  - [ ] Statistics displayed (Total Requests, etc.)
  - [ ] Recent requests table shows test request
  - [ ] Can view request details

---

### **Phase 5: API Testing (Optional)**

- [ ] **Health Check**
  ```bash
  curl http://localhost:5000/health
  ```

- [ ] **Chatbot API**
  ```bash
  curl -X POST http://localhost:5000/api/chat/send \
    -H "Content-Type: application/json" \
    -d '{"message":"Hello","sessionId":"test-123"}'
  ```

- [ ] **Create Request API**
  ```bash
  curl -X POST http://localhost:5000/api/requests \
    -H "Content-Type: application/json" \
    -d '{
      "name":"Test User",
      "email":"test@example.com",
      "phone":"+254712345678",
      "platform":"instagram",
      "accountIdentifier":"@testaccount",
      "issueDescription":"Test issue",
      "tier":"basic"
    }'
  ```

---

## 🎯 **Completion Status**

**Total Tasks:** 60+  
**Completed:** ___ / 60+  
**Progress:** ____%

---

## 📝 **Notes**

Use this space to track any issues or customizations:

```
Date: _______________

Issues encountered:
-

Solutions applied:
-

Custom configurations:
-

Next steps:
-
```

---

## 🎉 **Setup Complete!**

Once all checkboxes are marked:

✅ Your Vanilla Recovery Hub is fully operational!  
✅ Ready for local development and testing  
✅ Ready to proceed with customizations  
✅ Ready for production deployment (see DEPLOYMENT.md)

---

## 📞 **Need Help?**

- **Setup Issues:** See `SETUP_GUIDE.md`
- **API Testing:** See `API_EXAMPLES.md`
- **Development:** See `DEVELOPER_GUIDE.md`
- **Deployment:** See `DEPLOYMENT.md`

**Good luck! 🚀**
