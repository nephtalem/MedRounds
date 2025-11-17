# 🚀 Quick Start: Supabase Setup (5 Minutes)

## What You Need

Two pieces of information from Supabase:
1. **Project URL** - Where your database lives
2. **Anon Key** - Public API key for your app

---

## Step 1: Create Account & Project (2 min)

### Go to: https://supabase.com

1. **Sign up** (use GitHub for fastest signup)
2. Click **"New Project"**
3. Fill in:
   - Name: `medrounds`
   - Password: *(strong password - save it!)*
   - Region: *(choose closest to you)*
   - Plan: **Free**
4. Click **"Create project"**
5. Wait 2-3 minutes ☕

---

## Step 2: Get Your Credentials (1 min)

### In Supabase Dashboard:

1. Click **⚙️ Project Settings** (bottom of sidebar)
2. Click **"API"** in the menu
3. **Copy these TWO values:**

   📋 **Project URL**
   ```
   Looks like: https://xxxxxxxxxxxxx.supabase.co
   ```

   📋 **anon public key**
   ```
   Looks like: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.very_long_string...
   ```

---

## Step 3: Add to Your Project (1 min)

### Create `.env.local` file:

1. **In VS Code** (in root folder, same level as `package.json`):
   - New File → `.env.local`

2. **Paste this** (replace with YOUR values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_key
```

⚠️ **Important:**
- No quotes around values
- No extra spaces
- File must be named exactly `.env.local` (starts with a dot!)

3. **Save** (Ctrl+S)

---

## Step 4: Restart Server (30 sec)

### In Terminal:

```bash
# Stop current server
# Press: Ctrl+C

# Start again
npm run dev
```

---

## Step 5: Test Connection (30 sec)

### Open in browser:

```
http://localhost:3000/test-supabase
```

**Expected result:**
- ✅ Green badge: "Success" 
- Message: "Supabase connected successfully!"

**If you see error:**
- Check spelling in `.env.local`
- Make sure you restarted server
- Verify you copied FULL keys (they're very long!)

---

## ✅ Done! What's Next?

Once Supabase is connected, we're ready to:
1. ✅ Create database tables (once you share Excel columns)
2. ✅ Build patient management system
3. ✅ Add data persistence
4. ✅ Enable print functionality

---

## 📁 File Structure

Your project should now have:

```
medical-app/
├── .env.local          ← YOU CREATE THIS (credentials here)
├── package.json
├── src/
│   ├── app/
│   │   ├── test-supabase/   ← Test page to verify connection
│   │   ├── dashboard/
│   │   └── ...
│   └── lib/
│       └── supabase.ts      ← Supabase client (already created)
└── SUPABASE_SETUP_GUIDE.md  ← Detailed guide
```

---

## 🆘 Troubleshooting

### Problem: "Environment variables not configured"
**Fix:**
- Make sure `.env.local` is in ROOT folder (not inside `src/`)
- Restart dev server after creating file

### Problem: "Invalid API key"
**Fix:**
- Copy the FULL key (it's very long - 200+ characters)
- No spaces before/after the key
- No quotes around the key

### Problem: Can't find credentials in Supabase
**Fix:**
- Supabase Dashboard
- Settings (gear icon, bottom left)
- Click "API"
- Look for "Project URL" and "anon public" key

---

## 🎯 Quick Checklist

- [ ] Supabase account created
- [ ] Project created (wait for "Active" status)
- [ ] Project URL copied
- [ ] anon key copied
- [ ] `.env.local` file created in root
- [ ] Credentials pasted (no quotes)
- [ ] Dev server restarted
- [ ] Test page shows success (http://localhost:3000/test-supabase)

**All checked?** You're ready! 🎉

---

## What Supabase Gives You (Free Tier)

✅ 500MB PostgreSQL database  
✅ 50,000 monthly active users  
✅ Unlimited API requests  
✅ Authentication included  
✅ Real-time updates  
✅ Row Level Security  

**Perfect for hospital department use!**

---

## Next Steps

1. **Complete Supabase setup** ✓
2. **Share Excel column details** ⏳
3. **Create database tables** (we'll do this together)
4. **Build patient management** (1 day development)
5. **Deploy to production** 🚀

---

Need the detailed guide? See **`SUPABASE_SETUP_GUIDE.md`**

