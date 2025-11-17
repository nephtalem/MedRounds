# Ward-Based Patient Management System - Setup Guide

## Overview

The application has been successfully converted from a dynamic round-creation system to a **permanent ward-based system** with 3 fixed wards:

- **Ward 3**
- **Ward 4**
- **ICU**

## What Changed

### 🔄 Major Changes

1. **Fixed Ward Structure**: No more creating/deleting rounds. The 3 wards are permanent fixtures.

2. **Simplified Navigation**: Sidebar now shows direct links to Ward 3, Ward 4, and ICU instead of "Active Rounds" and "History".

3. **Auto-Update Dates**: Ward "date" field automatically updates when you add, edit, or delete a patient.

4. **Permanent Patient Deletion**: Patients are permanently deleted (no archive/history).

5. **New Dashboard**: Shows 3 ward cards with patient counts + total patients across all wards.

6. **Print Headers**: Print output now shows ward names (e.g., "Ward 3") instead of round numbers.

## Setup Instructions

### Step 1: Update Database Column Type

1. Open your **Supabase Dashboard** → SQL Editor
2. Run this to update the `date` column to support timestamps:

```sql
ALTER TABLE rounds
ALTER COLUMN date TYPE timestamptz
USING date::timestamptz;
```

### Step 2: Setup RLS Policies

Run the `update-database-policies.sql` script to configure proper Row Level Security:

- Allows all authenticated users to view/manage all wards
- Prevents creating/deleting wards (permanent only)
- Allows full patient management (add/edit/delete)

### Step 3: Run the SQL Setup Script

1. Run the `setup-permanent-rounds.sql` script
2. **Already configured** with your user ID
3. This will:
   - Delete all existing patients and rounds
   - Create the 3 permanent wards with timestamps

### Step 4: Verify Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to the dashboard - you should see 3 ward cards:

   - Ward 3 (purple)
   - Ward 4 (cyan)
   - ICU (rose)

3. Click on any ward to access its patient management page

### Step 5: (Optional) Add Test Data

If you want to test with sample patients, run the `test-patients-insert.sql` script:

- Update the `round_id` values to match your ward IDs
- Update the `user_id` to match your user ID
- Run the script in Supabase SQL Editor

## New Workflow

### For Doctors:

1. **Login** → Dashboard shows all 3 wards with patient counts
2. **Select a ward** from sidebar or dashboard cards
3. **Manage patients**:
   - Add new patients
   - Edit existing patients
   - Delete discharged patients (permanent deletion)
4. **Print ward rounds** directly from the ward page
5. **Export data** to Excel, CSV, or PDF

### Ward Date Auto-Update:

The "Last Updated" date for each ward automatically updates whenever:

- ✅ A patient is added
- ✅ A patient is edited
- ✅ A patient is deleted

## Navigation Structure

```
📱 Application
├── 🏠 Dashboard
│   └── Shows 3 ward cards + total patients
├── 🏥 Ward 3
│   └── Patient list + management
├── 🏥 Ward 4
│   └── Patient list + management
├── 🏥 ICU
│   └── Patient list + management
├── 👤 Profile
└── ⚙️ Settings
    └── Configure print headers, doctor info, etc.
```

## Print Configuration

Print headers can be customized in **Settings**:

- **Print Header**: Default is "Axon Neurology Specialty Center"
- **Print Subheader**: Default is "Daily Patient Rounds"
- **Professional Title**: Your name/title for print output

When printing, the ward name appears as "Round: Ward 3" (or Ward 4/ICU).

## Database Schema

No changes to the database schema were required! The existing structure works perfectly:

```sql
rounds table:
- id (uuid)
- user_id (uuid)
- date (date) -- Auto-updates on patient changes
- round_number (text) -- Stores "Ward 3", "Ward 4", or "ICU"
- status (text) -- Always "active"

patients table:
- (unchanged - all existing columns remain the same)
```

## Removed Features

The following features were removed as they're no longer needed:

- ❌ "Create Round" functionality
- ❌ "Active Rounds" list page
- ❌ "History/Archive" page
- ❌ Round status changes (completed/archived)
- ❌ Dynamic round creation

## Benefits

✅ **Simpler workflow** - No need to create rounds
✅ **Faster navigation** - Direct access to wards
✅ **Always organized** - Fixed structure everyone understands
✅ **No confusion** - Clear ward-based organization
✅ **Auto-updates** - Ward dates update automatically

## Troubleshooting

### "Ward Not Found" Error

**Cause**: The 3 permanent wards haven't been created yet.

**Solution**: Run the `setup-permanent-rounds.sql` script with your user ID.

### Dashboard Shows "No wards found"

**Cause**: Same as above - wards not created yet.

**Solution**: Run the setup script.

### Can't Access Settings

**Cause**: User metadata not set up.

**Solution**:

1. Go to Settings
2. Update your profile information
3. Save changes

## Next Steps

1. ✅ Run the setup SQL script
2. ✅ Verify all 3 wards appear on dashboard
3. ✅ Configure your settings (profile, print headers)
4. ✅ Add patients to test the system
5. ✅ Test printing functionality
6. 🚀 Start using the system!

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify the SQL script ran successfully
3. Confirm your user ID is correct in the rounds table
4. Restart the development server

---

**🎉 The new ward-based system is ready to use!**
