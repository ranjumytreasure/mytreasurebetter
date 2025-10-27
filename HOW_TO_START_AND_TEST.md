# How to Start and Test Daily Collection Company Management

## 🚀 Quick Start Guide

### **Step 1: Start Backend Server**

```bash
# Navigate to backend directory
cd "C:\Users\mail2\OneDrive\Desktop\Mani\Treasure Artifacts\Treasureservice\Latest from Github\treasure-service-main (1)\treasure-service-main"

# Install dependencies (if not already done)
npm install

# Start server
npm start
```

**Expected Output:**
```
Server is running on port 6001.
```

**Verify:**
- Open `http://localhost:6001/health` in browser
- Should see "Hello"

---

### **Step 2: Start Frontend App**

```bash
# Navigate to frontend directory
cd "C:\Users\mail2\OneDrive\Desktop\Mani\Treasure Artifacts\Cursor\Try1\treasure"

# Install dependencies (if not already done)
npm install

# Start app
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view treasure in the browser.
Local: http://localhost:3000
```

---

### **Step 3: Login and Navigate**

1. Open `http://localhost:3000`
2. Click "Login"
3. Enter credentials
4. You'll see **App Selection Page** with 3 apps
5. Click "**MyTreasure - Daily Collection App**"
6. You're now in Daily Collection with its own navbar
7. Click "**Companies**" in the navbar
8. You should see **Company Management** page

---

## ✅ **Test Company CRUD Operations**

### **TEST 1: CREATE Company**

**Steps:**
1. Click the "**+ Add Company**" button (top right)
2. Modal form opens
3. Fill in:
   ```
   Company Name: ABC Finance Ltd
   Contact Number: 9876543210
   Address: 123 Main Street, Mumbai, Maharashtra
   ```
4. Click "**Create Company**"

**Expected Result:**
- ✅ Modal closes
- ✅ Success message (if implemented)
- ✅ New company "ABC Finance Ltd" appears in the list
- ✅ No page refresh
- ✅ Company shows with all details

**Verify in Backend:**
- Check server console - should see POST request logged
- Check database: `SELECT * FROM dc_company;`

---

### **TEST 2: UPDATE Company**

**Steps:**
1. Find "ABC Finance Ltd" in the list
2. Click the **Edit button (✏️)**
3. Modal opens with pre-filled data
4. Change company name to "**ABC Finance Private Limited**"
5. Change contact to "**9876543211**"
6. Click "**Update Company**"

**Expected Result:**
- ✅ Modal closes
- ✅ Company name updates in list to "ABC Finance Private Limited"
- ✅ Contact updates to "9876543211"
- ✅ Changes appear IMMEDIATELY
- ✅ No page refresh

**Verify in Backend:**
- Check server console - should see PUT request logged
- Check database - `updated_at` should be refreshed

---

### **TEST 3: DELETE Company**

**Steps:**
1. Find any company in the list
2. Click the **Delete button (🗑️)**
3. Confirmation modal appears
4. Click "**Delete**" to confirm

**Expected Result:**
- ✅ Confirmation modal closes
- ✅ Company disappears from list IMMEDIATELY
- ✅ No page refresh
- ✅ List adjusts (no gaps)

**Verify in Backend:**
- Check server console - should see DELETE request logged
- Check database - record should be gone

---

### **TEST 4: Mobile Responsiveness**

**Steps:**
1. Open Chrome DevTools (F12)
2. Click "Toggle device toolbar" icon (or Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or "iPhone SE"
4. Refresh page

**Expected Result:**
- ✅ **Cards** display instead of table
- ✅ "+ Add Company" button full-width
- ✅ Each company in a card with icon
- ✅ Edit/Delete buttons easily tappable
- ✅ Form modal adapts to mobile
- ✅ All text readable

**Test Different Sizes:**
- iPhone SE (375px) - narrowest
- iPad (768px) - switches to table
- Desktop (1024px+) - full table

---

## 🔍 **Detailed Verification**

### **Check Network Requests:**

1. Open Chrome DevTools → Network tab
2. Perform any CRUD operation
3. You should see:

**Create:**
```
Request:
POST http://localhost:6001/api/v1/dc/companies
Headers: Authorization: Bearer <token>
Body: {
  "companyName": "ABC Finance Ltd",
  "contactNo": "9876543210",
  "address": "Mumbai",
  "membershipId": 1
}

Response:
{
  "success": true,
  "message": "Company added successfully",
  "results": { id: "...", company_name: "ABC Finance Ltd", ... }
}
```

**Update:**
```
Request:
PUT http://localhost:6001/api/v1/dc/companies
Body: {
  "companyId": "company-uuid",
  "companyName": "Updated Name",
  ...
}
```

**Delete:**
```
Request:
DELETE http://localhost:6001/api/v1/dc/companies/company-uuid
```

---

### **Check Database:**

Connect to PostgreSQL and run:

```sql
-- See all DC companies
SELECT * FROM dc_company ORDER BY created_at DESC;

-- Count companies per membership
SELECT parent_membership_id, COUNT(*) 
FROM dc_company 
GROUP BY parent_membership_id;

-- See company details with timestamps
SELECT 
  company_name, 
  contact_no, 
  created_at, 
  updated_at,
  created_by,
  updated_by
FROM dc_company;
```

---

### **Check Browser Console:**

Press F12 → Console tab

**Should see:**
- No red errors
- API calls logging (if you added console.logs)
- React component renders

**Should NOT see:**
- 404 errors
- 401 unauthorized
- CORS errors
- React warnings

---

## 🎨 **UI Elements to Verify**

### **Company Management Page:**
- [ ] Page title "Company Management"
- [ ] Subtitle "Manage companies for Daily Collection"
- [ ] "+ Add Company" button (red)
- [ ] Table headers (if desktop)
- [ ] Company cards (if mobile)
- [ ] Edit buttons (blue on hover)
- [ ] Delete buttons (red on hover)

### **Add/Edit Modal:**
- [ ] Modal appears centered
- [ ] Form fields visible
- [ ] "Company Name" field with red asterisk
- [ ] "Contact Number" field
- [ ] "Address" textarea
- [ ] "Cancel" button (gray)
- [ ] "Create/Update Company" button (red)
- [ ] Close X button (top right)

### **Delete Confirmation:**
- [ ] Modal appears with warning icon
- [ ] Shows company name being deleted
- [ ] "Cancel" button
- [ ] "Delete" button (red)

---

## 🐛 **Common Issues & Solutions**

### **Issue: "Cannot read property 'results' of undefined"**
**Cause:** User context not loaded  
**Solution:**
- Ensure you're logged in
- Check user context in React DevTools
- Verify token in localStorage

---

### **Issue: "Companies not loading"**
**Cause:** API not responding  
**Solution:**
1. Check backend is running on port 6001
2. Check CORS settings
3. Check Network tab for failed requests
4. Verify membershipId is being passed

---

### **Issue: "Company created but not showing"**
**Cause:** State not updating  
**Solution:**
1. Check browser console for errors
2. Verify dispatch is called
3. Check reducer logic
4. Try refreshing page manually

---

### **Issue: "401 Unauthorized"**
**Cause:** Token expired or missing  
**Solution:**
- Logout and login again
- Check token expiry
- Verify Authorization header

---

### **Issue: "Table dc_company doesn't exist"**
**Cause:** Database not synchronized  
**Solution:**
```javascript
// In server.js or after db connection:
db.sequelize.sync({ alter: true });
// Then restart backend
```

---

## 📊 **Expected Behavior Summary**

| Action | Frontend | Backend | Database | UI Update |
|--------|----------|---------|----------|-----------|
| **Create** | Modal form | POST /dc/companies | INSERT | Immediate |
| **Read** | Page load | GET /dc/companies | SELECT | On mount |
| **Update** | Edit modal | PUT /dc/companies | UPDATE | Immediate |
| **Delete** | Confirm dialog | DELETE /dc/companies/:id | DELETE | Immediate |

---

## 🎯 **Success Criteria**

All of these should work:
- ✅ Can create a company
- ✅ New company appears without refresh
- ✅ Can edit a company
- ✅ Changes reflect without refresh
- ✅ Can delete a company
- ✅ Company disappears without refresh
- ✅ Works on mobile (responsive)
- ✅ No errors in console
- ✅ Data isolated from Chit Fund app

---

## 📸 **Screenshot Locations for Verification**

Take screenshots to verify:
1. App Selection page (with 3 apps)
2. Daily Collection navbar
3. Company Management page (desktop)
4. Company Management page (mobile)
5. Add Company modal
6. Edit Company modal
7. Delete confirmation
8. Empty state (no companies)

---

## 🎊 **You're All Set!**

Everything is implemented and ready to test. Follow the steps above to verify that:
- Backend is working correctly
- Frontend is responsive
- CRUD operations function properly
- State updates immediately
- Data is properly isolated

**Happy Testing! 🚀**

Need help? Check the troubleshooting section or the detailed implementation documents.















