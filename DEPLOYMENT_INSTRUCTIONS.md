# Deployment Instructions - Duplicate Index Fix

## ⚠️ Important: Pre-Deployment Step Required

**You need to run a SQL script BEFORE deploying**, or the error will likely persist.

---

## 🎯 Recommended Approach (Guaranteed to Work)

### Step 1: Run SQL Fix Script (BEFORE Deployment)

Connect to your **production database** and run:

```sql
-- Drop the duplicate index
DROP INDEX IF EXISTS "dc_day_book_details_day_book_id_transaction_type_category_subcategory";

-- Create the correct index (matching model definition)
CREATE UNIQUE INDEX IF NOT EXISTS "dc_day_book_details_unique_idx" 
ON "dc_day_book_details" ("day_book_id", "transaction_type", "category", "subcategory");
```

**Or use the complete script**: Run `fix_duplicate_index.sql` file

### Step 2: Deploy the Code

After running the SQL script:
1. Deploy the updated code (with `alter: true`)
2. Restart your application
3. Monitor logs - should see "Synced db." without errors

---

## 🔄 Alternative: Try Deploy First (Might Work)

If you want to try deploying first without running SQL:

### What Will Happen:
- `alter: true` will attempt to sync the schema
- **It might still fail** because Sequelize tries to create the index before checking if it exists
- If it fails, you'll see the same error

### If It Fails:
1. Run the SQL script above
2. Restart the application
3. It should work now

---

## ✅ Verification After Deployment

Check your application logs for:
```
Synced db.
```

If you see this message, the fix worked! ✅

If you still see the error, run the SQL script and restart.

---

## 📋 Quick Checklist

- [ ] **Backup production database** (IMPORTANT!)
- [ ] Run SQL fix script on production database
- [ ] Deploy updated code
- [ ] Restart application
- [ ] Check logs for "Synced db." message
- [ ] Verify application is working normally

---

## 🚨 Why SQL Script is Needed

The duplicate index already exists in your database. Sequelize's `alter: true` is smart, but it:
- Compares model definition with current schema
- Tries to create missing indexes
- **May not automatically drop duplicate indexes with different names**

So the SQL script manually removes the duplicate and ensures the correct one exists.


