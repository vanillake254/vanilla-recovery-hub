# 🚀 START HERE - PostgreSQL Setup

## ✅ **What Just Happened?**

Your Vanilla Recovery Hub has been **converted from MongoDB to PostgreSQL**! 

**Benefits:**
- ✅ Everything on **ONE platform** (Railway)  
- ✅ **Simpler setup** (no MongoDB Atlas)  
- ✅ **Better performance** (database + backend on same network)  
- ✅ **Type-safe queries** with Prisma ORM  

---

## 📋 **Quick Setup (5 Minutes)**

### **Step 1: Create Railway PostgreSQL Database (2 min)**

1. Visit: **https://railway.app**
2. Sign up with GitHub (free)
3. Click "**+ New**" → "**Database**" → "**PostgreSQL**"
4. Wait 15 seconds for database to provision
5. Click on PostgreSQL service → "**Variables**" tab
6. **Copy the DATABASE_URL** (entire value)

---

### **Step 2: Configure Backend (.env file) (1 min)**

Open: `/backend/.env`

**Paste your Railway DATABASE_URL:**

```bash
# PostgreSQL - Paste your Railway DATABASE_URL here
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@region.railway.app:5432/railway

# Flutterwave Test Keys
FLW_PUBLIC_KEY=FLWPUBK_TEST-your-key-here
FLW_SECRET_KEY=FLWSECK_TEST-your-key-here
FLW_ENCRYPTION_KEY=FLWSECK_TEST-your-key-here

# Keep everything else the same
SUCCESS_URL=http://localhost:3000/payment-success
FAIL_URL=http://localhost:3000/payment-failed
FRONTEND_URL=http://localhost:3000
JWT_SECRET=43db8162f329de9cdfb5ccd05cdbd8c8405f28fa8b5baafaf7dc95b7f5396278
EMAIL_API_KEY=re_your-key-here
ADMIN_EMAIL=admin@vanillarecoveryhub.com
PORT=5000
NODE_ENV=development
```

**Note:** You still need Flutterwave keys for payments. Get them from https://flutterwave.com/ke/signup

---

### **Step 3: Initialize Database (1 min)**

Run these commands:

```bash
cd /home/vanilla-ke/development/VANILLA\ RECOVERY\ HUB/backend

# Push schema to database (creates all tables)
npx prisma db push

# Start backend
npm run dev
```

Expected output:
```
✅ PostgreSQL connected successfully
🚀 Server running on port 5000
```

---

### **Step 4: Test It Works (30 sec)**

**Test health endpoint:**
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected"
}
```

**View your database (optional):**
```bash
npx prisma studio
```
Opens at http://localhost:5555 with visual database browser

---

### **Step 5: Start Frontend (30 sec)**

In a new terminal:
```bash
cd /home/vanilla-ke/development/VANILLA\ RECOVERY\ HUB/frontend
npm run dev
```

Visit: **http://localhost:3000**

---

## ✅ **You're Done!**

Your app is now running with PostgreSQL on Railway!

---

## 🎯 **Next Steps**

### **Still Need to Configure:**

1. **Flutterwave Test Keys** (for payments)
   - Sign up: https://flutterwave.com/ke/signup
   - Go to Settings → API Keys
   - Copy all 3 TEST keys
   - Paste into `/backend/.env`

2. **Test Complete Flow:**
   - Visit http://localhost:3000
   - Click "Start Recovery"
   - Fill form and submit
   - Should redirect to Flutterwave payment page
   - Use test card (see RAILWAY_POSTGRES_SETUP.md)

---

## 📚 **Full Documentation**

| Document | Purpose |
|----------|---------|
| **[RAILWAY_POSTGRES_SETUP.md](./RAILWAY_POSTGRES_SETUP.md)** | Complete setup guide with troubleshooting |
| **[POSTGRES_CONVERSION_SUMMARY.md](./POSTGRES_CONVERSION_SUMMARY.md)** | What changed and why |
| **[README.md](./README.md)** | Project overview |
| **[API_EXAMPLES.md](./API_EXAMPLES.md)** | Test API endpoints |

---

## 🆘 **Troubleshooting**

### **"Cannot connect to database"**
→ Check DATABASE_URL is correctly pasted in `.env`

### **"Prisma Client not generated"**
→ Run: `npx prisma generate`

### **"Table does not exist"**
→ Run: `npx prisma db push`

### **Backend won't start**
→ Check all environment variables in `.env`

---

## 📊 **What's Different?**

| Before (MongoDB) | After (PostgreSQL) |
|-----------------|-------------------|
| MongoDB Atlas | Railway PostgreSQL |
| Mongoose ORM | Prisma ORM |
| 2 platforms | 1 platform |
| `_id` | `id` |
| `.find()` | `.findMany()` |
| `.populate()` | `.include{}` |

**Your API responses are the same! Frontend needs NO changes.**

---

## 🎉 **Summary**

✅ PostgreSQL database ready  
✅ Prisma ORM configured  
✅ All controllers converted  
✅ Schema synced  
✅ Type-safe queries  
✅ Better performance  
✅ Simpler deployment  

**Ready to build! 🚀**

---

## 💬 **Quick Commands**

```bash
# View database
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma db push --force-reset

# Check database schema
npx prisma db pull

# Generate types
npx prisma generate
```

---

**Questions? Check RAILWAY_POSTGRES_SETUP.md for detailed instructions!**
