# 🗄️ Supabase Setup Guide for MedRounds

## Overview

Supabase is your backend - it provides:
- **PostgreSQL Database** (stores patient data, rounds)
- **Authentication** (user login/signup)
- **Real-time subscriptions** (multi-user updates)
- **Row Level Security** (data protection)
- **Auto-generated APIs** (no backend code needed!)

---

## Step-by-Step Setup

### ✅ Step 1: Create Supabase Account

1. Visit: **https://supabase.com**
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up with:
   - ✅ **GitHub** (recommended - fastest, 1-click)
   - Or email/password

---

### ✅ Step 2: Create New Project

1. After login, you'll see the Supabase Dashboard
2. Click the **"New Project"** button (green button, top right)

3. **Fill in the form:**

   | Field | Value | Notes |
   |-------|-------|-------|
   | **Organization** | Select existing or create new | Use default or create "Hospital" |
   | **Project Name** | `medrounds` | Or `medical-app` |
   | **Database Password** | *(generate strong password)* | **SAVE THIS!** Use password manager |
   | **Region** | Choose closest location | See region guide below |
   | **Pricing Plan** | **Free** | Includes everything you need! |

4. **Region Selection Guide:**
   - 🌏 `Southeast Asia (Singapore)` - India, Asia Pacific
   - 🇺🇸 `East US (North Virginia)` - US East Coast
   - 🇺🇸 `West US (Oregon)` - US West Coast
   - 🇪🇺 `Europe West (Ireland)` - UK, Europe
   - 🇪🇺 `Europe Central (Frankfurt)` - Central Europe

5. Click **"Create new project"**

6. ⏳ **Wait 2-3 minutes** while project provisions (grab coffee ☕)

---

### ✅ Step 3: Get Your API Credentials

Once the project shows **"Active"** status:

#### **Navigate to API Settings:**

1. Look at the **left sidebar**
2. Scroll to bottom → Click **⚙️ "Project Settings"** (gear icon)
3. In settings menu → Click **"API"**

#### **Copy These Two Values:**

You'll see a page with several API details. Copy these:

**1️⃣ Project URL**
```
Section: "Project URL" or "API URL"
Format: https://xxxxxxxxxxxxx.supabase.co
Example: https://abcdefghijklmno.supabase.co
```
📋 Click the copy icon next to it

**2️⃣ Anon Key (Public Key)**
```
Section: "Project API keys"
Label: "anon" or "anon public"
Format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX...
(This is a very long string - JWT token)
```
📋 Click the copy icon next to it

⚠️ **Note:** There's also a `service_role` key - **DO NOT use this in the frontend!** It bypasses security.

---

### ✅ Step 4: Add Credentials to MedRounds

#### **Create `.env.local` file:**

1. **Open your project in VS Code** (or your editor)
2. **In the root directory** (same level as `package.json`):
   - Right-click → New File
   - Name it: `.env.local`

3. **Paste this content:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Replace the placeholders:**
   - Replace `YOUR_PROJECT_URL_HERE` with your actual Project URL
   - Replace `YOUR_ANON_KEY_HERE` with your actual anon key
   - **No quotes needed!** Just paste the values directly

5. **Example (with fake data):**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmno.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ubyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk4MDA2MDAwLCJleHAiOjIwMTM1ODIwMDB9.fake_signature_here

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

6. **Save the file** (Ctrl+S / Cmd+S)

---

### ✅ Step 5: Verify Setup

#### **Restart your development server:**

1. **Stop the current server:**
   - Go to terminal
   - Press `Ctrl+C`

2. **Restart with new env variables:**
   ```bash
   npm run dev
   ```

3. **Check for errors:**
   - Should start without errors
   - Open http://localhost:3000

#### **Test Supabase Connection:**

Create a test file to verify connection works:

**File: `src/app/test-supabase/page.tsx`**

```typescript
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestSupabase() {
  const [status, setStatus] = useState("Testing...");

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from("test").select("*").limit(1);
        if (error) {
          // Table doesn't exist yet - but connection works!
          if (error.message.includes("does not exist")) {
            setStatus("✅ Connected! (No tables yet - expected)");
          } else {
            setStatus(`❌ Error: ${error.message}`);
          }
        } else {
          setStatus("✅ Connected successfully!");
        }
      } catch (err) {
        setStatus(`❌ Connection failed: ${err}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}
```

Visit: **http://localhost:3000/test-supabase**

- ✅ **"Connected!"** = Perfect!
- ❌ **"Connection failed"** = Check your credentials

---

## 📋 What You Get with Free Tier

✅ **Database:**
- 500MB PostgreSQL storage
- Unlimited API requests
- Real-time subscriptions

✅ **Authentication:**
- 50,000 monthly active users
- Email, social logins
- Row Level Security

✅ **Storage:**
- 1GB file storage
- For future: upload PDFs, images

✅ **Bandwidth:**
- 2GB egress per month
- More than enough for hospital department

---

## 🔐 Security Best Practices

### ✅ **DO:**
- ✅ Use `.env.local` for credentials
- ✅ Add `.env.local` to `.gitignore` (already done)
- ✅ Use `anon` key in frontend
- ✅ Enable Row Level Security (RLS) on tables

### ❌ **DON'T:**
- ❌ Commit `.env.local` to Git
- ❌ Use `service_role` key in frontend
- ❌ Share credentials publicly
- ❌ Use same credentials for prod & dev

---

## 📊 Next Steps: Create Database Tables

Once you have the Excel column details, we'll create tables:

### **Example: Patients Table**
```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id UUID REFERENCES rounds(id),
  serial_no INTEGER,
  name TEXT NOT NULL,
  age INTEGER,
  -- More fields based on Excel columns
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

We'll create these through Supabase's SQL editor (super easy!).

---

## 🆘 Troubleshooting

### **Problem: Environment variables not loading**
**Solution:**
```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

### **Problem: "Invalid API key"**
**Solution:**
- Check for typos in `.env.local`
- No quotes around values
- No extra spaces
- Make sure you copied the full key (it's very long!)

### **Problem: Can't find Project URL**
**Solution:**
- Go to Supabase Dashboard
- Project Settings (gear icon)
- API section
- Look for "Project URL" or "API URL"

### **Problem: ".env.local not found"**
**Solution:**
- File must be in root directory (not `src/`)
- File name is `.env.local` (starts with dot!)
- On Windows: Save as "All Files" to avoid `.env.local.txt`

---

## ✅ Checklist

Before continuing, make sure:

- [ ] Supabase account created
- [ ] New project created and active
- [ ] Project URL copied
- [ ] Anon key copied
- [ ] `.env.local` file created in root
- [ ] Credentials pasted correctly (no quotes)
- [ ] Development server restarted
- [ ] No errors when starting server

---

## 🎯 You're Ready!

Once this is done, your app can:
- ✅ Connect to Supabase
- ✅ Store patient data
- ✅ Authenticate users (later)
- ✅ Handle real-time updates

**Next:** Once you share the Excel columns, we'll create the database tables and complete the patient management system!

---

## 📞 Need Help?

If you run into any issues:
1. Check the troubleshooting section above
2. Verify credentials in Supabase dashboard
3. Check browser console for errors (F12)
4. Make sure dev server restarted after adding `.env.local`

**Common issue:** Forgetting to restart the server after creating `.env.local` file!

