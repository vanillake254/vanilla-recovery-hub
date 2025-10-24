# 🚂 Railway PostgreSQL Setup Guide

Your Vanilla Recovery Hub now uses **PostgreSQL with Prisma ORM** instead of MongoDB. This means **ONE platform for everything** - both database and backend hosting on Railway!

---

## 🎯 **Why PostgreSQL on Railway?**

✅ **Simpler Setup** - Everything in one place  
✅ **No External Accounts** - No need for MongoDB Atlas  
✅ **Free Tier** - $5/month credit (covers development)  
✅ **Better Performance** - Database and backend on same network  
✅ **Automatic Backups** - Built into Railway  
✅ **Production Ready** - Easy to scale  

---

## ⚡ **Quick Setup (5 Minutes)**

### **Step 1: Create Railway Account (1 min)**

Visit: **https://railway.app**

- Click "Start a New Project"
- Sign up with GitHub (recommended)
- No credit card required for free tier

### **Step 2: Create PostgreSQL Database (1 min)**

1. In Railway Dashboard:
   - Click "**+ New**"
   - Select "**Database**"
   - Choose "**PostgreSQL**"
   
2. Wait 10-15 seconds for database to provision

3. Click on the PostgreSQL service

4. Go to "**Variables**" tab

5. Copy the **`DATABASE_URL`** value
   - It looks like: `postgresql://postgres:password@region.railway.app:5432/railway`
   - This is your complete connection string!

### **Step 3: Configure Local Development (2 min)**

Open `/backend/.env` and paste your Railway DATABASE_URL:

```bash
# PostgreSQL - Paste your Railway DATABASE_URL here
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@region.railway.app:5432/railway

# Keep everything else the same
FLW_PUBLIC_KEY=FLWPUBK_TEST-your-key
FLW_SECRET_KEY=FLWSECK_TEST-your-key
FLW_ENCRYPTION_KEY=FLWSECK_TEST-your-key

SUCCESS_URL=http://localhost:3000/payment-success
FAIL_URL=http://localhost:3000/payment-failed
FRONTEND_URL=http://localhost:3000

JWT_SECRET=43db8162f329de9cdfb5ccd05cdbd8c8405f28fa8b5baafaf7dc95b7f5396278

EMAIL_API_KEY=re_your-key-here
ADMIN_EMAIL=admin@vanillarecoveryhub.com

PORT=5000
NODE_ENV=development
```

### **Step 4: Initialize Database (1 min)**

Run these commands in your backend directory:

```bash
cd /home/vanilla-ke/development/VANILLA\ RECOVERY\ HUB/backend

# Generate Prisma Client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push

# View your database (optional)
npx prisma studio
```

Expected output:
```
✔ Generated Prisma Client
✔ Database synchronized
✔ All tables created successfully
```

### **Step 5: Start Backend (30 sec)**

```bash
npm run dev
```

You should see:
```
✅ PostgreSQL connected successfully
🚀 Server running on port 5000
```

### **Step 6: Test It Works**

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-01-24T...",
  "uptime": 5.123
}
```

**✅ Done! Your backend is running with PostgreSQL!**

---

## 🗄️ **Database Schema**

Your PostgreSQL database has these tables:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **users** | User accounts | id, email, name, phone, role |
| **requests** | Recovery requests | id, userId, platform, status, txRef |
| **payments** | Payment records | id, requestId, amount, status |
| **chat_logs** | Chat conversations | id, sessionId, messages, status |
| **notes** | Request comments/notes | id, requestId, userId, text |

**All relationships are properly connected with foreign keys!**

---

## 🔄 **Common Commands**

### **View Database (GUI)**
```bash
npx prisma studio
```
Opens at: http://localhost:5555

### **Update Schema**
After changing `prisma/schema.prisma`:
```bash
npx prisma db push
npx prisma generate
```

### **Reset Database** (⚠️ Deletes all data)
```bash
npx prisma db push --force-reset
```

### **Seed Database** (Add test data)
```bash
npx prisma db seed
```

---

## 🚀 **Deploy to Railway (Production)**

### **1. Connect GitHub Repository**

1. Push your code to GitHub:
```bash
cd /home/vanilla-ke/development/VANILLA\ RECOVERY\ HUB
git add .
git commit -m "Converted to PostgreSQL with Prisma"
git push origin main
```

2. In Railway Dashboard:
   - Click "**+ New**"
   - Select "**GitHub Repo**"
   - Choose your repository
   - Select `backend` as root directory

### **2. Configure Environment Variables**

In Railway, go to your backend service → **Variables** tab:

Add these variables:
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Links to your PostgreSQL
FLW_PUBLIC_KEY=FLWPUBK_TEST-your-key
FLW_SECRET_KEY=FLWSECK_TEST-your-key
FLW_ENCRYPTION_KEY=FLWSECK_TEST-your-key
SUCCESS_URL=https://your-frontend.web.app/payment-success
FAIL_URL=https://your-frontend.web.app/payment-failed
FRONTEND_URL=https://your-frontend.web.app
JWT_SECRET=43db8162f329de9cdfb5ccd05cdbd8c8405f28fa8b5baafaf7dc95b7f5396278
EMAIL_API_KEY=re_your-key
ADMIN_EMAIL=admin@vanillarecoveryhub.com
NODE_ENV=production
PORT=5000
```

**Note:** `${{Postgres.DATABASE_URL}}` automatically links to your PostgreSQL database!

### **3. Configure Build Settings**

Railway should auto-detect, but verify:

- **Build Command:** `npm install && npx prisma generate`
- **Start Command:** `npm start`
- **Root Directory:** `backend`

### **4. Deploy**

Railway will automatically:
1. Install dependencies
2. Generate Prisma Client
3. Start your server
4. Give you a public URL (e.g., `https://vanilla-recovery-hub-backend.up.railway.app`)

### **5. Initialize Production Database**

After first deploy, run migrations:

In Railway Dashboard → Your Backend Service → **Settings** → **Deploy**:

Add this to **Post-Deploy Command** (optional):
```
npx prisma db push
```

Or run it manually once from your local machine with production DATABASE_URL.

---

## 💰 **Railway Pricing**

### **Free Tier** ($5 credit/month)
- **PostgreSQL**: ~500 hours/month
- **Backend**: ~500 hours/month
- **Storage**: 1GB
- **Perfect for development & testing**

### **When to Upgrade**
- Production traffic > 1000 requests/day
- Need > 1GB database storage
- Want custom domains
- Need team collaboration

**Estimated cost for small production app:** $10-20/month

---

## 🔍 **Monitoring Your Database**

### **Railway Dashboard**
- View connection count
- Check storage usage
- Monitor query performance
- View logs

### **Prisma Studio** (Local)
```bash
npx prisma studio
```
- Browse all tables
- Edit data directly
- Run custom queries

### **SQL Queries**
Connect with any PostgreSQL client using your DATABASE_URL:
- **TablePlus** (GUI)
- **pgAdmin** (GUI)
- **psql** (CLI)

---

## 🆘 **Troubleshooting**

### **"Cannot connect to database"**

**Solution:**
1. Check DATABASE_URL is correctly copied
2. Ensure no extra spaces
3. Verify Railway database is running
4. Check firewall/network settings

### **"Prisma Client not generated"**

**Solution:**
```bash
npx prisma generate
```

### **"Table does not exist"**

**Solution:**
```bash
npx prisma db push
```

### **"Connection pool timeout"**

**Solution:**
Add to DATABASE_URL:
```
?connection_limit=5&pool_timeout=10
```

### **Need to reset everything?**

**Solution:**
```bash
npx prisma db push --force-reset
npx prisma db push
```

---

## 📊 **What Changed from MongoDB?**

| Feature | MongoDB (Before) | PostgreSQL (Now) |
|---------|------------------|------------------|
| **Database** | MongoDB Atlas | Railway PostgreSQL |
| **ORM** | Mongoose | Prisma |
| **Schema** | Flexible documents | Strict tables with relations |
| **IDs** | `_id` (ObjectId) | `id` (CUID) |
| **Queries** | `.find()`, `.findOne()` | `.findMany()`, `.findUnique()` |
| **Relations** | `.populate()` | `.include{}` |
| **Hosting** | Separate (Atlas + Railway) | One platform (Railway) |

**All API responses remain the same! Frontend doesn't need any changes.**

---

## ✅ **Verification Checklist**

- [ ] Railway account created
- [ ] PostgreSQL database provisioned
- [ ] DATABASE_URL copied to `.env`
- [ ] Flutterwave keys configured
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma db push`
- [ ] Backend starts without errors
- [ ] Health endpoint returns `database: connected`
- [ ] Can view database in Prisma Studio
- [ ] Frontend can communicate with backend

---

## 🎉 **Benefits Summary**

**Before (MongoDB):**
- MongoDB Atlas account needed
- Separate platforms to manage
- Complex connection strings
- Network latency between services

**After (PostgreSQL):**
- ✅ Everything on Railway
- ✅ One dashboard to manage
- ✅ Automatic DATABASE_URL injection
- ✅ Faster performance (same network)
- ✅ Better relations and data integrity
- ✅ Built-in backups

---

## 📚 **Learn More**

- **Prisma Docs:** https://www.prisma.io/docs
- **Railway Docs:** https://docs.railway.app
- **PostgreSQL Tutorial:** https://www.postgresqltutorial.com

---

## 🚀 **Next Steps**

1. Complete Flutterwave setup (if not done)
2. Test full payment flow
3. Deploy to Railway production
4. Configure custom domain (optional)
5. Set up monitoring/alerts

**You're ready to build! 🎉**
