# 🗄️ Database Setup Guide

## Step 1: Create Database Tables in Supabase

### **Go to Supabase SQL Editor:**

1. Open your Supabase project: https://supabase.com
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New Query"**

### **Copy and Paste This SQL:**

Open the file: `supabase-schema.sql` in your project root

Copy ALL the SQL code and paste it into the Supabase SQL Editor.

### **Run the Query:**

Click **"Run"** or press `Ctrl + Enter`

You should see: ✅ **"Success. No rows returned"**

---

## ✅ What This Creates:

### **Tables:**

1. **`rounds`** - Stores round sessions
   - Links to authenticated user
   - Has date, status, round number
2. **`patients`** - Stores patient data
   - 10 columns from your Excel sheet
   - Links to rounds table
   - Auto-numbering (serial_no)

### **Security (Row Level Security - RLS):**

- ✅ Users can only see their own rounds
- ✅ Users can only see patients in their rounds
- ✅ Complete data isolation between users
- ✅ Secure by default!

### **Features:**

- ✅ UUID primary keys
- ✅ Foreign key relationships
- ✅ Automatic timestamps
- ✅ Cascade deletes (delete round = delete patients)
- ✅ Indexed for performance

---

## Step 2: Verify Tables Were Created

In Supabase:

1. Go to **"Table Editor"**
2. You should see:
   - `rounds` table
   - `patients` table

---

## Step 3: Test Data (Optional)

You can insert a test round:

```sql
-- Get your user ID first
SELECT id, email FROM auth.users;

-- Insert a test round (replace YOUR_USER_ID)
INSERT INTO rounds (user_id, date, status)
VALUES ('YOUR_USER_ID', CURRENT_DATE, 'active');
```

---

## ✅ Database Schema Overview

### **Rounds Table:**

```
id              UUID (Primary Key)
user_id         UUID (Links to auth.users)
date            DATE
round_number    TEXT
status          TEXT (active/completed/archived)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### **Patients Table:**

```
id                      UUID (Primary Key)
round_id                UUID (Links to rounds)
name                    TEXT (Required)
brief_history           TEXT
diagnosis               TEXT
physical_examination    TEXT
imaging                 TEXT
lab_result              TEXT
incident                TEXT
medications             TEXT
plan                    TEXT
round                   TEXT
serial_no               INTEGER
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

---

## 🔐 Security Policies

**All queries are automatically filtered by user:**

- When you fetch rounds, you only get YOUR rounds
- When you fetch patients, you only get patients from YOUR rounds
- No way to access other users' data!

---

## Next Steps

Once you've run the SQL in Supabase:

1. ✅ Database is ready!
2. ✅ Security is configured!
3. ✅ We can build the UI!

---

**Let me know when you've run the SQL in Supabase, and I'll build the patient management interface!** 🚀
