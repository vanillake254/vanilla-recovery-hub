# Switch to IntaSend TEST Mode

## Why?
Your LIVE account isn't verified yet (2 days waiting). Use TEST mode to:
- ✅ Test the payment flow
- ✅ Make sure everything works
- ✅ Switch to LIVE once verified

## Steps:

### 1. Get TEST API Keys

Go to: https://payment.intasend.com/account/api-keys/

**Switch to TEST environment** (toggle at top)

Copy:
- TEST Publishable Key (starts with `ISPubKey_test_...`)
- TEST Secret Key (starts with `ISSecretKey_test_...`)

### 2. Update Railway Variables

Go to Railway → Your Project → Backend → Variables

**Replace:**
```
INTASEND_PUBLISHABLE_KEY=ISPubKey_test_YOUR_KEY_HERE
INTASEND_SECRET_KEY=ISSecretKey_test_YOUR_KEY_HERE
```

### 3. Test Payments

- Use TEST M-PESA number: `254712345678`
- Use any email
- Payments will be simulated (no real money)

### 4. When LIVE is Verified

Just replace TEST keys with LIVE keys in Railway!

---

## OR: Use Manual M-PESA (Simplest!)

**Skip all this API hassle:**

1. Show users your M-PESA number
2. They pay directly
3. They send confirmation code
4. You verify manually
5. Start recovery

**Pros:**
- ✅ Works TODAY
- ✅ No verification needed
- ✅ No API issues
- ✅ Simple!

**Want me to implement manual M-PESA instead?**
