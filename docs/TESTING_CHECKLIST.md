# ✅ Testing Checklist for MedRounds

## Pre-Testing Setup

- [ ] Database tables created in Supabase (rounds, patients)
- [ ] `.env.local` file exists with Supabase credentials
- [ ] Dev server running (`npm run dev`)
- [ ] Logged in to the application

---

## 1. Authentication Flow ✅

### Sign Up
- [ ] Navigate to /auth/signup
- [ ] Enter full name, email, password
- [ ] Submit form
- [ ] Redirected to dashboard
- [ ] User profile shows in sidebar

### Login
- [ ] Navigate to /auth/login
- [ ] Enter email and password
- [ ] Submit form
- [ ] Redirected to dashboard

### Profile
- [ ] Navigate to /profile
- [ ] See current name and email
- [ ] Update full name
- [ ] Click "Save Changes"
- [ ] Success message appears
- [ ] Name updates in sidebar

### Logout
- [ ] Click user menu in sidebar
- [ ] Click "Sign Out"
- [ ] Redirected to homepage
- [ ] Can no longer access dashboard

---

## 2. Dashboard ✅

- [ ] See stats cards (Active Rounds, Total Patients, Reports)
- [ ] All numbers display correctly
- [ ] "Create New Round" button works
- [ ] "View All Rounds" button works
- [ ] Sidebar navigation works
- [ ] User dropdown works
- [ ] Page is responsive (resize browser)

---

## 3. Round Management ✅

### Create Round
- [ ] Click "Active Rounds" in sidebar OR "Create New Round"
- [ ] Click "+ New Round" button
- [ ] Dialog opens
- [ ] Today's date is pre-filled
- [ ] Enter round number (e.g., "Morning Round")
- [ ] Click "Create Round"
- [ ] Redirected to round detail page
- [ ] Round information displays correctly

### View Rounds List
- [ ] Navigate to /rounds
- [ ] See list of active rounds
- [ ] Each card shows:
  - Date
  - Round number
  - Patient count (should be 0 initially)
  - Status badge
- [ ] Click "View Round" opens round details

---

## 4. Patient Management ✅

### Add Patient
- [ ] In a round, click "+ Add Patient"
- [ ] Dialog opens with 10 fields
- [ ] All fields are empty
- [ ] Enter patient name (required)
- [ ] Fill in other fields (optional)
- [ ] Click "Add Patient"
- [ ] Dialog closes
- [ ] Patient appears in table
- [ ] Serial number is "1"

### Add Multiple Patients
- [ ] Add 5-10 patients
- [ ] Each gets sequential serial number (1, 2, 3...)
- [ ] All appear in table
- [ ] Patient count updates

### View Patient Table
- [ ] Table shows all 10 columns
- [ ] Data displays correctly
- [ ] Long text is truncated with "..."
- [ ] Actions button (⋮) shows for each patient
- [ ] Table scrolls horizontally if needed

### Edit Patient
- [ ] Click "⋮" on any patient
- [ ] Click "Edit"
- [ ] Dialog opens with current data
- [ ] Modify some fields
- [ ] Click "Update Patient"
- [ ] Dialog closes
- [ ] Changes appear in table immediately

### Delete Patient
- [ ] Click "⋮" on any patient
- [ ] Click "Delete"
- [ ] Confirmation dialog appears
- [ ] Click "OK"
- [ ] Patient removed from table
- [ ] Patient count updates

---

## 5. Search & Filter ✅

### Search Patients
- [ ] Type in search bar
- [ ] Results filter in real-time
- [ ] Search works for: name, diagnosis, medications
- [ ] "Showing X of Y patients" updates
- [ ] Click "Clear" resets search

### No Results
- [ ] Search for non-existent term
- [ ] See "No patients found matching your search"
- [ ] Clear search shows all patients again

---

## 6. Print Functionality ✅

### Print Preview
- [ ] In a round with patients, click "Print"
- [ ] Print preview opens
- [ ] Sidebar is hidden
- [ ] Buttons are hidden
- [ ] Navigation is hidden
- [ ] Round info shows at top
- [ ] Patient table shows all data
- [ ] Layout is landscape
- [ ] Everything fits on page

### Print Settings
- [ ] Orientation: Landscape works
- [ ] All columns are visible
- [ ] Text is readable
- [ ] Borders show on table
- [ ] Can save as PDF
- [ ] PDF looks professional

---

## 7. Navigation ✅

### Sidebar Links
- [ ] Dashboard link works
- [ ] Active Rounds link works
- [ ] New Round button works
- [ ] Profile link works
- [ ] Settings link works (placeholder)
- [ ] History link works (placeholder)
- [ ] Templates link works (placeholder)

### Breadcrumbs
- [ ] Show current location
- [ ] Clickable breadcrumbs work
- [ ] Navigate back works

### Back Button
- [ ] "Back" button in round details works
- [ ] Returns to previous page

---

## 8. Data Persistence ✅

### After Page Reload
- [ ] Refresh browser
- [ ] Still logged in
- [ ] Rounds still exist
- [ ] Patients still exist
- [ ] All data intact

### After Logout/Login
- [ ] Log out
- [ ] Log back in
- [ ] See same rounds
- [ ] See same patients
- [ ] Data is persistent

---

## 9. Security ✅

### Protected Routes
- [ ] Log out
- [ ] Try to access /dashboard
- [ ] Redirected to /auth/login
- [ ] Try to access /rounds
- [ ] Redirected to /auth/login
- [ ] Log in works again

### Data Isolation
- [ ] Create second account (different email)
- [ ] Log in with second account
- [ ] Should see no rounds
- [ ] Create round and patients
- [ ] Log out
- [ ] Log in with first account
- [ ] Should NOT see second account's data
- [ ] ✅ Data is isolated!

---

## 10. Error Handling ✅

### Form Validation
- [ ] Try to add patient without name
- [ ] See "Name is required" error
- [ ] Try to create round with invalid date
- [ ] Form prevents submission

### Network Errors
- [ ] Turn off internet (or disconnect Supabase)
- [ ] Try to add patient
- [ ] See error message
- [ ] Reconnect
- [ ] Try again - works

---

## 11. UI/UX ✅

### Visual Design
- [ ] Medical Blue color scheme throughout
- [ ] Consistent spacing
- [ ] Clean, modern look
- [ ] Professional appearance
- [ ] Icons are appropriate
- [ ] Hover effects work
- [ ] Active states are clear

### Responsive Design
- [ ] Resize browser to mobile size
- [ ] Sidebar collapses (if implemented)
- [ ] Tables scroll horizontally
- [ ] Forms are usable
- [ ] Buttons are accessible
- [ ] Text is readable

### Loading States
- [ ] See loading spinner when fetching data
- [ ] See "Saving..." when submitting forms
- [ ] No blank states
- [ ] Smooth transitions

---

## 12. Performance ✅

- [ ] Pages load quickly
- [ ] Forms submit instantly
- [ ] Search is real-time
- [ ] No lag when typing
- [ ] Smooth scrolling
- [ ] No console errors (F12)

---

## Common Issues & Fixes

### Issue: Can't log in
**Fix:** Check `.env.local` has correct Supabase credentials

### Issue: Tables not showing
**Fix:** Verify SQL was run in Supabase SQL Editor

### Issue: Data not saving
**Fix:** Check Supabase RLS policies are enabled

### Issue: Print looks wrong
**Fix:** Use Landscape orientation in print settings

### Issue: Styles not loading
**Fix:** Hard refresh (Ctrl+Shift+R) and clear cache

---

## ✅ Testing Complete Checklist

- [ ] All authentication flows work
- [ ] Can create and view rounds
- [ ] Can add, edit, delete patients
- [ ] Search functionality works
- [ ] Print functionality works
- [ ] Navigation is smooth
- [ ] Data persists correctly
- [ ] Security works (RLS)
- [ ] UI looks professional
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Fast and performant

---

## 🎉 Ready for Production?

If all checkboxes are checked:
- ✅ Your app is working perfectly!
- ✅ Ready to show hospital administration!
- ✅ Safe to use for daily rounds!

---

**Last Updated:** November 15, 2025

