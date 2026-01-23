# 🧪 Testing Guide - Bug Tracker Application

## 📋 Overview

This document provides comprehensive testing procedures for the Bug Tracker MERN application. Follow these steps to ensure all features work correctly before deployment.

---

## 🔐 Authentication Testing

### Test 1: User Registration
**Steps:**
1. Navigate to `/register`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!@#
3. Click "Register"

**Expected Result:**
- ✅ Success toast appears
- ✅ Redirected to dashboard
- ✅ User is logged in
- ✅ Token stored in localStorage

**Error Cases to Test:**
- ❌ Empty fields → Validation error
- ❌ Invalid email format → "Invalid email" error
- ❌ Weak password → Password requirements error
- ❌ Duplicate email → "Email already exists" error

---

### Test 2: User Login
**Steps:**
1. Navigate to `/login`
2. Enter credentials:
   - Email: test@example.com
   - Password: Test123!@#
3. Click "Login"

**Expected Result:**
- ✅ Success toast appears
- ✅ Redirected to dashboard
- ✅ User data loaded
- ✅ Sidebar shows user name

**Error Cases to Test:**
- ❌ Wrong password → "Invalid credentials" error
- ❌ Non-existent email → "User not found" error
- ❌ Empty fields → Validation error

---

### Test 3: User Logout
**Steps:**
1. Click "Logout" button in sidebar
2. Confirm logout

**Expected Result:**
- ✅ Redirected to login page
- ✅ Token removed from localStorage
- ✅ Cannot access protected routes
- ✅ Success toast appears

---

### Test 4: Protected Routes
**Steps:**
1. Logout
2. Try accessing `/dashboard`, `/projects`, `/tickets`

**Expected Result:**
- ✅ Redirected to `/login`
- ✅ Original URL preserved for redirect after login

---

## 📁 Project Management Testing

### Test 5: Create Project
**Steps:**
1. Navigate to `/projects`
2. Click "Create New Project"
3. Fill in form:
   - Name: Test Project
   - Description: This is a test project
   - Owner: (Your user)
4. Click "Create Project"

**Expected Result:**
- ✅ Success toast appears
- ✅ Project appears in project list
- ✅ Project card shows correct details
- ✅ Can click to view project details

**Error Cases:**
- ❌ Empty name → Validation error
- ❌ Name too long (>100 chars) → Error message

---

### Test 6: View Project Details
**Steps:**
1. Click on a project card
2. Navigate to project detail page

**Expected Result:**
- ✅ Project name displayed
- ✅ Description shown
- ✅ Owner information visible
- ✅ Member list displayed
- ✅ Ticket count shown
- ✅ Edit button visible (if owner)

---

### Test 7: Update Project
**Steps:**
1. On project detail page, click "Edit"
2. Update name: "Updated Test Project"
3. Update description: "Updated description"
4. Click "Save Changes"

**Expected Result:**
- ✅ Success toast appears
- ✅ Project details updated immediately
- ✅ Changes reflected in project list

---

### Test 8: Delete Project
**Steps:**
1. On project detail page, click "Delete"
2. Confirm deletion in modal

**Expected Result:**
- ✅ Confirmation modal appears
- ✅ After confirmation, success toast appears
- ✅ Redirected to projects list
- ✅ Project removed from list
- ✅ All associated tickets deleted

---

## 🎫 Ticket Management Testing

### Test 9: Create Ticket
**Steps:**
1. Navigate to `/tickets/create` or click "New Ticket"
2. Fill in form:
   - Title: Login Bug
   - Description: Users cannot log in with correct credentials
   - Type: Bug
   - Priority: High
   - Status: Open
   - Project: Test Project
   - Due Date: (Future date)
3. Click "Create Ticket"

**Expected Result:**
- ✅ Success toast appears
- ✅ Redirected to ticket detail page
- ✅ All details displayed correctly
- ✅ Reporter shows your name
- ✅ Created date shows current date

**Error Cases:**
- ❌ Empty title → Validation error
- ❌ Title too long → Error message
- ❌ No project selected → Error message
- ❌ Past due date → Warning or error

---

### Test 10: View Ticket List
**Steps:**
1. Navigate to `/tickets`
2. View all tickets

**Expected Result:**
- ✅ All tickets displayed in grid/table
- ✅ Correct status badges (Open, In Progress, Closed)
- ✅ Priority colors displayed (High=red, Medium=yellow, Low=green)
- ✅ Type icons shown (Bug, Feature, Task)
- ✅ Click ticket to view details

---

### Test 11: Filter Tickets
**Steps:**
1. On tickets page, use filter bar
2. Test each filter:
   - Search: "login"
   - Project: Select project
   - Status: "Open"
   - Priority: "High"
   - User: "My Tickets"

**Expected Result:**
- ✅ URL updates with query params
- ✅ Tickets filtered correctly
- ✅ Result count displayed
- ✅ Clear filters button appears
- ✅ Active filters shown as badges
- ✅ Can remove individual filters

---

### Test 12: View Ticket Details
**Steps:**
1. Click on a ticket
2. View ticket detail page

**Expected Result:**
- ✅ Full ticket details displayed
- ✅ Description formatted correctly
- ✅ All metadata shown (type, status, priority, dates)
- ✅ Reporter and assignee info visible
- ✅ Project link shown
- ✅ Edit/Delete buttons visible (if authorized)
- ✅ Comments section visible

---

### Test 13: Update Ticket
**Steps:**
1. On ticket detail page, click "Edit"
2. Update in modal:
   - Title: "Updated Login Bug"
   - Status: "In Progress"
   - Priority: "Critical"
3. Click "Save"

**Expected Result:**
- ✅ Modal closes
- ✅ Success toast appears
- ✅ Details updated immediately
- ✅ No page refresh needed

---

### Test 14: Assign Ticket
**Steps:**
1. On ticket detail page
2. Select assignee from dropdown
3. Click assign button

**Expected Result:**
- ✅ Success toast appears
- ✅ Assignee name displayed
- ✅ Avatar/initials shown
- ✅ Can reassign to different user

---

### Test 15: Delete Ticket
**Steps:**
1. On ticket detail page, click "Delete"
2. Confirm deletion in modal

**Expected Result:**
- ✅ Warning modal appears with ticket name
- ✅ After confirmation, success toast
- ✅ Redirected to tickets list
- ✅ Ticket removed from list

---

## 💬 Comments System Testing

### Test 16: Add Comment
**Steps:**
1. On ticket detail page
2. Scroll to comments section
3. Type comment: "I'm working on this issue"
4. Click "Add Comment"

**Expected Result:**
- ✅ Success toast appears
- ✅ Comment appears immediately
- ✅ Shows your name and avatar
- ✅ Timestamp displayed
- ✅ Comment text formatted correctly

**Error Cases:**
- ❌ Empty comment → Validation error
- ❌ Comment too long → Character limit error

---

### Test 17: Edit Comment
**Steps:**
1. Click edit button on your comment
2. Update text: "Updated: Still working on this"
3. Click "Save"

**Expected Result:**
- ✅ Comment updated immediately
- ✅ "Edited" label appears
- ✅ Success toast shown

---

### Test 18: Delete Comment
**Steps:**
1. Click delete button on your comment
2. Confirm deletion

**Expected Result:**
- ✅ Confirmation modal appears
- ✅ Comment removed after confirmation
- ✅ Success toast shown
- ✅ Comments count updated

---

## 📋 Kanban Board Testing

### Test 19: View Kanban Board
**Steps:**
1. Navigate to `/kanban`
2. View board

**Expected Result:**
- ✅ Three columns: To Do, In Progress, Done
- ✅ Tickets in correct columns based on status
- ✅ Tickets show title, priority, type
- ✅ Empty states shown for empty columns

---

### Test 20: Drag and Drop Tickets
**Steps:**
1. Drag a ticket from "To Do" to "In Progress"
2. Drop the ticket

**Expected Result:**
- ✅ Ticket moves to new column
- ✅ Status updates automatically
- ✅ Success toast appears
- ✅ Change persists on page refresh
- ✅ Smooth animation during drag

**Edge Cases:**
- ✅ Cannot drop outside valid columns
- ✅ Ticket snaps back if drop fails
- ✅ Multiple tickets can be moved

---

### Test 21: Quick View from Kanban
**Steps:**
1. Click on a ticket card in kanban
2. View details

**Expected Result:**
- ✅ Navigates to ticket detail page
- ✅ All details visible
- ✅ Back button returns to kanban

---

## 📊 Analytics Testing

### Test 22: View Analytics Dashboard
**Steps:**
1. Navigate to `/analytics`
2. View analytics

**Expected Result:**
- ✅ Total tickets count displayed
- ✅ Tickets by status chart shown
- ✅ Tickets by priority chart shown
- ✅ Tickets by type chart shown
- ✅ Recent activity list displayed
- ✅ Top contributors shown
- ✅ Charts update with real data

---

## 📱 Mobile Responsiveness Testing

### Test 23: Mobile Layout (320px - 768px)
**Steps:**
1. Open Chrome DevTools
2. Toggle device toolbar
3. Select "iPhone SE" or similar
4. Navigate through all pages

**Expected Result:**
- ✅ Sidebar collapses to hamburger menu
- ✅ Forms are single column
- ✅ Tables/cards stack vertically
- ✅ Buttons are touch-friendly (min 44px)
- ✅ Text is readable (min 16px)
- ✅ No horizontal scrolling
- ✅ Modals fit screen
- ✅ Kanban columns stack or scroll

**Pages to Test:**
- Login/Register
- Dashboard
- Projects list & detail
- Tickets list & detail
- Kanban board
- Analytics

---

### Test 24: Tablet Layout (768px - 1024px)
**Steps:**
1. Set viewport to iPad size
2. Navigate through all pages

**Expected Result:**
- ✅ Sidebar stays visible or collapses
- ✅ Two-column layouts work
- ✅ Grid layouts adjust (2 columns)
- ✅ Touch targets adequate
- ✅ Charts scale properly

---

### Test 25: Desktop Layout (1024px+)
**Steps:**
1. View on desktop resolution
2. Test all features

**Expected Result:**
- ✅ Full sidebar visible
- ✅ Multi-column layouts work
- ✅ Hover states functional
- ✅ Dropdowns work properly
- ✅ Optimal use of screen space

---

## ⚡ Performance Testing

### Test 26: Page Load Times
**Steps:**
1. Open Chrome DevTools → Network tab
2. Hard refresh each page (Ctrl+Shift+R)
3. Check load times

**Expected Result:**
- ✅ Initial load < 3 seconds
- ✅ Subsequent pages < 1 second
- ✅ API calls < 500ms
- ✅ Images optimized
- ✅ No console errors

---

### Test 27: Bundle Size
**Steps:**
1. Run `npm run build` in frontend
2. Check dist folder size

**Expected Result:**
- ✅ Total bundle < 1MB
- ✅ JavaScript chunks optimized
- ✅ CSS minimized
- ✅ No unused dependencies

---

## 🔐 Security Testing

### Test 28: JWT Token Handling
**Steps:**
1. Login
2. Check localStorage
3. Make API call
4. Logout

**Expected Result:**
- ✅ Token stored securely
- ✅ Token included in API requests
- ✅ Token removed on logout
- ✅ Expired tokens handled gracefully

---

### Test 29: Authorization
**Steps:**
1. Try to edit/delete others' tickets
2. Try to delete others' projects
3. Try accessing admin routes

**Expected Result:**
- ✅ Appropriate error messages
- ✅ Buttons hidden if not authorized
- ✅ Backend validates permissions
- ✅ No unauthorized actions succeed

---

## 🐛 Error Handling Testing

### Test 30: Network Errors
**Steps:**
1. Turn off backend server
2. Try various actions
3. Turn server back on

**Expected Result:**
- ✅ Error toasts appear
- ✅ User-friendly error messages
- ✅ No app crashes
- ✅ Can retry actions
- ✅ App recovers when server returns

---

### Test 31: Invalid Data
**Steps:**
1. Enter invalid data in forms
2. Submit incomplete data
3. Test field validations

**Expected Result:**
- ✅ Validation errors shown
- ✅ Specific error messages
- ✅ Required fields marked
- ✅ Cannot submit invalid data

---

### Test 32: 404 Errors
**Steps:**
1. Navigate to `/invalid-route`
2. Try accessing non-existent ticket: `/tickets/999999`
3. Try accessing deleted resource

**Expected Result:**
- ✅ 404 page displayed
- ✅ Helpful navigation options
- ✅ Can return to valid pages
- ✅ No blank screens

---

## 🧪 End-to-End User Flow

### Test 33: Complete User Journey
**Steps:**
1. Register new account
2. Login
3. Create a project
4. Add team members (if available)
5. Create multiple tickets
6. Assign tickets to users
7. Move tickets through kanban
8. Add comments to tickets
9. Update ticket details
10. View analytics
11. Filter and search tickets
12. Delete a ticket
13. Logout

**Expected Result:**
- ✅ All steps complete successfully
- ✅ No errors encountered
- ✅ Data persists correctly
- ✅ UI updates in real-time
- ✅ Smooth user experience

---

## 📊 Test Results Template

Use this template to track your testing:

```
Test Date: _______________
Tester: _______________
Environment: Development / Production

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | User Registration | ✅ Pass | |
| 2 | User Login | ✅ Pass | |
| 3 | User Logout | ✅ Pass | |
| ... | ... | ... | ... |

Overall Status: Pass / Fail
Issues Found: ___ (list below)
```

---

## 🐛 Bug Report Template

If you find bugs, document them:

```
Bug Title: _______________
Severity: Critical / High / Medium / Low
Steps to Reproduce:
1. _______________
2. _______________
3. _______________

Expected Behavior: _______________
Actual Behavior: _______________
Screenshots: (attach if available)
Browser: _______________
Device: _______________
Date Found: _______________
```

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All 33 tests pass
- [ ] No critical bugs found
- [ ] Mobile responsive on all pages
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Error handling works
- [ ] Loading states implemented
- [ ] Toast notifications working
- [ ] 404 page functional
- [ ] Backend health check working
- [ ] Environment variables set
- [ ] Database connection stable

---

## 🎯 Testing Best Practices

1. **Test in Multiple Browsers**
   - Chrome
   - Firefox
   - Safari
   - Edge

2. **Test on Real Devices**
   - iOS devices
   - Android devices
   - Different screen sizes

3. **Test Different User Roles**
   - New user
   - Existing user
   - Project owner
   - Regular member

4. **Test Edge Cases**
   - Empty states
   - Maximum limits
   - Special characters
   - Long text inputs

5. **Performance Testing**
   - Large data sets
   - Slow network
   - High concurrent users

---

## 📞 Support

If you encounter issues during testing:
- Check browser console for errors
- Review network tab for failed requests
- Check backend logs
- Refer to troubleshooting guide in DEPLOYMENT.md

---

**Last Updated**: Day 14 - Final Testing Phase
