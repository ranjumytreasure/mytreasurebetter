-- =====================================================
-- SQL QUERIES TO DELETE RECORDS FROM dc_ledger_entries
-- ⚠️ USE WITH CAUTION - THESE QUERIES DELETE DATA PERMANENTLY
-- =====================================================

-- =====================================================
-- OPTION 1: Delete ALL records (Use with extreme caution!)
-- =====================================================

-- PostgreSQL / MySQL
DELETE FROM dc_ledger_entries;

-- If you're using soft deletes (deleted_at column), use:
-- DELETE FROM dc_ledger_entries WHERE deleted_at IS NULL;


-- =====================================================
-- OPTION 2: Delete records for specific membership
-- =====================================================

-- Delete entries for a specific membership ID
DELETE FROM dc_ledger_entries 
WHERE parent_membership_id = 1;  -- Replace 1 with actual membership ID


-- =====================================================
-- OPTION 3: Delete records for date range
-- =====================================================

-- Delete entries created between two dates
DELETE FROM dc_ledger_entries 
WHERE created_at >= '2024-01-01' 
  AND created_at < '2024-01-31';


-- =====================================================
-- OPTION 4: Delete records by category
-- =====================================================

-- Delete entries for specific category
DELETE FROM dc_ledger_entries 
WHERE category = 'Collection';


-- =====================================================
-- SAFE APPROACH: Backup first, then delete
-- =====================================================

-- STEP 1: Create backup table (PostgreSQL)
CREATE TABLE dc_ledger_entries_backup AS 
SELECT * FROM dc_ledger_entries;

-- STEP 2: Verify backup
SELECT COUNT(*) FROM dc_ledger_entries_backup;
SELECT COUNT(*) FROM dc_ledger_entries;
-- Should show same count

-- STEP 3: Now delete (after verifying backup)
-- DELETE FROM dc_ledger_entries;


-- =====================================================
-- ⚠️ IMPORTANT: Consider related tables that depend on entries
-- =====================================================

-- If you delete ledger entries, you should also consider:

-- 1. Delete related Day Book data (since it's calculated from entries)
DELETE FROM dc_day_book_details;
DELETE FROM dc_day_book;

-- 2. Reset ledger account balances
UPDATE dc_ledger_accounts 
SET current_balance = opening_balance;


-- =====================================================
-- COMPLETE CLEANUP (All related tables)
-- =====================================================

-- If you want to completely reset all ledger-related data:

-- Step 1: Delete Day Book Details (depends on Day Book)
DELETE FROM dc_day_book_details;

-- Step 2: Delete Day Book (calculated from entries)
DELETE FROM dc_day_book;

-- Step 3: Delete Ledger Entries
DELETE FROM dc_ledger_entries;

-- Step 4: Reset Account Balances (optional - reset to opening balance)
UPDATE dc_ledger_accounts 
SET current_balance = opening_balance;

-- Step 5: Delete Ledger Accounts (optional - if you want to start fresh)
-- DELETE FROM dc_ledger_accounts;


-- =====================================================
-- CHECK RECORD COUNT BEFORE DELETING
-- =====================================================

-- See how many records will be affected
SELECT COUNT(*) as total_records FROM dc_ledger_entries;

-- See breakdown by category
SELECT category, COUNT(*) as count, SUM(amount) as total_amount
FROM dc_ledger_entries
GROUP BY category;

-- See breakdown by membership
SELECT parent_membership_id, COUNT(*) as count
FROM dc_ledger_entries
GROUP BY parent_membership_id;


-- =====================================================
-- SOFT DELETE (If table has deleted_at column)
-- =====================================================

-- Instead of hard delete, mark as deleted (safer)
-- UPDATE dc_ledger_entries 
-- SET deleted_at = NOW()
-- WHERE deleted_at IS NULL;


