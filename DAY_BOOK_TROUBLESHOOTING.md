# Day Book Troubleshooting Guide

## Issue: Loan Disbursement Not Showing in Day Book

### Problem Description
You disbursed a loan with `payment_date: 2025-11-03` but don't see the spent amount in the day book.

---

## ✅ Step-by-Step Debugging

### Step 1: Check the Date You're Viewing
**CRITICAL**: Day book shows transactions based on `payment_date`, not `created_at`.

- If `payment_date = 2025-11-03`, you must view day book for **2025-11-03**
- If you're viewing today's day book, you won't see it if today ≠ 2025-11-03

**Action**: 
1. In Day Book tab, change the date to **2025-11-03**
2. Click "Refresh" button to force recalculation

---

### Step 2: Force Recalculate Day Book
The day book might be cached from before the loan was disbursed.

**Action**:
1. Click the "Refresh" button in Day Book tab
2. This forces recalculation with `force_recalculate=true`

**Or manually**:
- Add `?force_recalculate=true` to the API URL
- Or delete the day_book record for that date and it will recalculate

---

### Step 3: Verify Ledger Entry Was Created
Check if the ledger entry exists with correct data:

**Query** (run in database):
```sql
SELECT 
    id,
    category,
    payment_date,
    amount,
    description,
    created_at
FROM dc_ledger_entries
WHERE payment_date = '2025-11-03'
  AND category = 'Loan Disbursement'
  AND deleted_at IS NULL
ORDER BY created_at DESC;
```

**Expected**:
- `category` should be `'Loan Disbursement'`
- `payment_date` should be `'2025-11-03'`
- `amount` should be negative (e.g., -50000)

---

### Step 4: Check Backend Logs
Look for these log messages when fetching day book:

```
🔍 Date filtering: Looking for entries on 2025-11-03
📋 Found X entries for this specific date
📝 Sample entries (first 3): ...
📊 Category breakdown: ...
💸 Total Spent for 2025-11-03: ...
```

**If you see "No entries found"**:
- The entry might have different `payment_date`
- Check the actual `payment_date` in database

---

### Step 5: Verify Category Logic
The day book categorizes entries as:

**Collections** (total_received):
- Category = 'Collection'
- Category = 'Income'

**Expenses** (total_spent):
- Category = 'Loan Disbursement' ✅
- Category = 'Expense'

**Check**:
- Is the category exactly `'Loan Disbursement'`? (case-sensitive)
- Not `'loan_disbursement'` or `'Loan disbursement'`

---

### Step 6: Check Amount Sign
Loan disbursements should have **negative amount** (money going out).

The day book uses `Math.abs(amount)` for expenses, so:
- Entry amount: `-50000`
- Day book shows: `50000` in total_spent ✅

**Verify**:
```sql
SELECT amount FROM dc_ledger_entries 
WHERE category = 'Loan Disbursement' 
  AND payment_date = '2025-11-03';
-- Should be negative, e.g., -50000
```

---

## 🐛 Common Issues & Fixes

### Issue 1: Looking at Wrong Date
**Symptom**: Entry exists but not showing in day book

**Fix**: 
- Navigate to the correct date (2025-11-03 in your case)
- Click Refresh

---

### Issue 2: Day Book Not Recalculated
**Symptom**: Day book shows old cached data

**Fix**:
1. Click "Refresh" button (forces recalculation)
2. Or add `?force_recalculate=true` to API call
3. Or manually delete day_book record for that date

---

### Issue 3: Payment Date Mismatch
**Symptom**: Entry has different payment_date than expected

**Fix**:
- Check actual `payment_date` in database
- View day book for that actual date
- Or update entry's `payment_date` if incorrect

---

### Issue 4: Category Name Mismatch
**Symptom**: Entry exists but not categorized as expense

**Fix**:
- Verify category is exactly `'Loan Disbursement'` (case-sensitive)
- If different, update the entry or fix the loan disbursement code

---

## 🔍 SQL Queries for Debugging

### Check if entry exists:
```sql
SELECT * FROM dc_ledger_entries
WHERE payment_date = '2025-11-03'
  AND category = 'Loan Disbursement';
```

### Check day book for that date:
```sql
SELECT * FROM dc_day_book
WHERE date = '2025-11-03';
```

### Check day book details:
```sql
SELECT * FROM dc_day_book_details
WHERE day_book_id IN (
    SELECT id FROM dc_day_book 
    WHERE date = '2025-11-03'
);
```

### Find all entries with payment_date:
```sql
SELECT 
    payment_date,
    category,
    COUNT(*) as count,
    SUM(ABS(amount)) as total
FROM dc_ledger_entries
WHERE deleted_at IS NULL
GROUP BY payment_date, category
ORDER BY payment_date DESC;
```

---

## ✅ Quick Fix Checklist

- [ ] Viewing day book for date: **2025-11-03** (not today)
- [ ] Clicked "Refresh" button to force recalculation
- [ ] Verified entry exists with `payment_date = '2025-11-03'`
- [ ] Verified category is `'Loan Disbursement'` (exact match)
- [ ] Verified amount is negative (e.g., -50000)
- [ ] Checked backend logs for any errors
- [ ] Entry is not soft-deleted (`deleted_at IS NULL`)

---

## 📞 If Still Not Working

1. **Check Backend Console Logs**:
   - Look for the day book calculation logs
   - Check for any errors

2. **Verify Database**:
   - Run SQL queries above
   - Confirm entry exists with correct data

3. **Test with New Entry**:
   - Create a manual ledger entry with payment_date = today
   - Check if it appears in today's day book
   - This confirms the calculation is working

4. **Check Date Format**:
   - payment_date should be 'YYYY-MM-DD' format
   - '2025-11-03' not '03-11-2025' or '11/03/2025'

---

**Most Common Issue**: Viewing wrong date! Make sure you're viewing day book for **2025-11-03**, not today's date.

