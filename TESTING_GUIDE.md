# 🧪 Complete Testing Guide - Vanilla Recovery Hub

## 🔗 Production URLs

### Frontend
```
https://vanillarecoveryhub.web.app
```

### Backend API
```
https://vanilla-recovery-hub-production.up.railway.app
```

### Health Check
```bash
curl https://vanilla-recovery-hub-production.up.railway.app/health
```

---

## ✅ Test Checklist

### 1. Backend API Tests

#### Health Check
```bash
curl -s https://vanilla-recovery-hub-production.up.railway.app/health | jq .
```

**Expected Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 123.45
}
```

#### Create User
```bash
curl -X POST https://vanilla-recovery-hub-production.up.railway.app/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+254700000000"
  }' | jq .
```

---

### 2. Frontend Tests

#### Home Page
- ✅ Visit: https://vanillarecoveryhub.web.app
- ✅ Check hero section loads
- ✅ Check pricing cards display
- ✅ Check FAQ section works
- ✅ Check chatbot icon appears

#### Recovery Form
- ✅ Visit: https://vanillarecoveryhub.web.app/recover?tier=basic
- ✅ Fill out form with test data
- ✅ Submit and verify payment redirect

#### Admin Login
- ✅ Visit: https://vanillarecoveryhub.web.app/admin/login
- ✅ Use credentials:
  - Email: `admin@vanillarecoveryhub.com`
  - Password: `admin123`
- ✅ Verify dashboard loads

---

### 3. Payment Flow Test (TEST MODE)

#### Test Card Details (Flutterwave Test)
```
Card Number: 5531886652142950
CVV: 564
Expiry: 09/32
PIN: 3310
OTP: 12345
```

#### Steps:
1. Go to https://vanillarecoveryhub.web.app
2. Click "Get Started" on Basic tier
3. Fill recovery form:
   - Name: Test User
   - Email: your-email@example.com
   - Phone: +254700000000
   - Platform: Instagram
   - Description: Test recovery
   - Email Access: Yes
4. Click "Proceed to Payment"
5. Use test card above
6. Complete payment
7. Verify redirect to success page
8. Check email for confirmation

---

### 4. Chat Widget Test

1. Click chat icon (bottom right)
2. Type: "Hello"
3. Verify bot responds
4. Type: "How much does recovery cost?"
5. Verify bot provides pricing info

---

### 5. Admin Dashboard Test

#### Login
```
URL: https://vanillarecoveryhub.web.app/admin/login
Email: admin@vanillarecoveryhub.com
Password: admin123
```

#### Check Stats
- ✅ Total requests count
- ✅ Revenue display
- ✅ Platform breakdown chart
- ✅ Recent requests table

#### View Requests
- ✅ Navigate to Requests page
- ✅ Filter by status
- ✅ Search by email/phone
- ✅ View request details

---

## 🔧 API Endpoint Tests

### Create Recovery Request
```bash
curl -X POST https://vanilla-recovery-hub-production.up.railway.app/api/requests/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "platform": "instagram",
    "description": "Account hacked, need recovery",
    "hasEmailAccess": true
  }' | jq .
```

### Initiate Payment
```bash
curl -X POST https://vanilla-recovery-hub-production.up.railway.app/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "requestId": "REQUEST_ID_HERE",
    "amount": 1500,
    "tier": "basic"
  }' | jq .
```

### Verify Payment
```bash
curl https://vanilla-recovery-hub-production.up.railway.app/api/payments/verify/TX_REF_HERE | jq .
```

### Chat Send Message
```bash
curl -X POST https://vanilla-recovery-hub-production.up.railway.app/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "message": "Hello, I need help",
    "context": {}
  }' | jq .
```

---

## 🎯 Expected Behaviors

### Payment Success Flow
1. User fills form → Request created in database
2. Payment initiated → Flutterwave payment page opens
3. User completes payment → Webhook received
4. Payment verified → Request status updated
5. Email sent → User receives confirmation
6. Redirect to success page → Shows transaction details

### Payment Failure Flow
1. User cancels payment → Redirect to failure page
2. Shows retry option
3. Request remains in "NEW" status

### Chat Flow
1. User opens chat widget
2. Bot greets user
3. User asks question
4. Bot provides relevant answer
5. If escalated → Admin notified

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution:** Verify `FRONTEND_URL` in Railway variables matches:
```
https://vanillarecoveryhub.web.app
```

### Issue: Payment Webhook Not Received
**Solution:** Check Flutterwave webhook URL is set to:
```
https://vanilla-recovery-hub-production.up.railway.app/api/payments/webhook
```

### Issue: Database Connection Error
**Solution:** Check `DATABASE_URL` is set correctly in Railway

### Issue: Email Not Sending
**Solution:** Verify `EMAIL_API_KEY` (Resend) is valid

---

## 📊 Monitoring

### Check Backend Logs
```bash
cd backend
railway logs
```

### Check Backend Status
```bash
railway status
```

### View Environment Variables
```bash
railway variables
```

---

## 🔐 Security Checklist

- ✅ All API keys in environment variables
- ✅ CORS restricted to frontend domain
- ✅ JWT authentication on admin routes
- ✅ Rate limiting enabled
- ✅ Input validation on all endpoints
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (React)

---

## 📈 Performance Targets

- **Page Load:** < 3 seconds
- **API Response:** < 500ms
- **Database Query:** < 100ms
- **Payment Redirect:** < 2 seconds

---

## ✅ Pre-Production Checklist

Before switching to production Flutterwave keys:

- [ ] All test payments successful
- [ ] Email notifications working
- [ ] Chat widget functional
- [ ] Admin dashboard accessible
- [ ] All forms validated
- [ ] Error handling tested
- [ ] Mobile responsive verified
- [ ] SEO meta tags present
- [ ] Analytics configured
- [ ] Backup strategy in place

---

## 🚀 Go Live Steps

1. **Test Everything Above** ✅
2. **Switch Flutterwave to Production Keys**
3. **Update Webhook URL in Flutterwave Dashboard**
4. **Test One Real Payment**
5. **Monitor for 24 Hours**
6. **Announce Launch** 🎉

---

**Current Status:** ✅ TEST MODE - Ready for Testing
**Next Step:** Complete all tests above, then switch to production keys
