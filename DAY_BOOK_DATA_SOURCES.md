# Day Book - Data Source Tables 📊

## Overview

Day Book uses a **hybrid approach** (Option B):
- **Primary**: Stores calculated data in dedicated tables for fast retrieval
- **Fallback**: Calculates from ledger entries if stored data doesn't exist
- **Auto-updates**: When new ledger entries are created

---

## 📋 Tables Used

### 1. **Primary Tables (Storage - Option B)**

#### `dc_day_book`
**Purpose**: Stores daily summary balances
**Fields Used**:
- `date` - The date for this day book
- `parent_membership_id` - Membership ID
- `opening_balance` - Balance at start of day
- `closing_balance` - Balance at end of day
- `total_received` - Total collections/income
- `total_spent` - Total expenses/disbursements
- `calculated_at` - When it was calculated
- `last_updated_at` - Last update timestamp

**Query Location**: 
- `getDayBook()` - Line 385-397: Fetches stored day book data

#### `dc_day_book_details`
**Purpose**: Stores category-wise breakdown
**Fields Used**:
- `day_book_id` - Foreign key to `dc_day_book`
- `transaction_type` - 'COLLECTION' or 'EXPENSE'
- `category` - Category name (e.g., 'Collection', 'Loan Disbursement')
- `subcategory` - Subcategory (e.g., 'Loan Payments', 'New Loans')
- `amount` - Total amount for this category/subcategory
- `transaction_count` - Number of transactions

**Query Location**:
- `getDayBook()` - Line 390-395: Fetched via JOIN/include
- Shows: Collections by category & Expenses by category

---

### 2. **Source Tables (For Calculation)**

#### `dc_ledger_entries`
**Purpose**: Source of all transactions (used when calculating/storing day book)
**Fields Used**:
- `parent_membership_id` - Filter by membership
- `created_at` - Date filter (to get entries for specific date)
- `category` - Determine if COLLECTION or EXPENSE
- `subcategory` - For breakdown
- `amount` - Transaction amount

**Query Location**:
- `calculateAndStoreDayBook()` - Line 455-462: 
  ```javascript
  const entries = await db.dcLedgerEntry.findAll({
      where: {
          parent_membership_id: membershipId,
          created_at: {
              [db.Sequelize.Op.between]: [startOfDay, endOfDay]
          }
      },
      attributes: ['category', 'subcategory', 'amount']
  });
  ```

**Used For**:
- Calculating totals for the day
- Grouping by category/subcategory
- Storing in `dc_day_book` and `dc_day_book_details`

#### `dc_ledger_accounts`
**Purpose**: Used to calculate previous day's closing balance
**Fields Used**:
- `parent_membership_id` - Filter by membership
- `opening_balance` - Account's initial balance
- `current_balance` - Not directly used, calculated from entries

**Query Location**:
- `calculatePreviousDayClosing()` - Line 327-329:
  ```javascript
  const accounts = await db.dcLedgerAccount.findAll({
      where: { parent_membership_id: membershipId }
  });
  ```

**Used For**:
- Getting all accounts for membership
- Calculating what balance was at previous day end
- Used to determine opening balance for current day

---

## 🔄 Data Flow

### When Viewing Day Book:

```
1. User requests Day Book for date X
   ↓
2. Check dc_day_book table (Primary)
   ├─ If EXISTS: ✅ Return stored data (FAST - 5-20ms)
   └─ If NOT EXISTS: ⚠️ Calculate from source tables
       ↓
3. calculateAndStoreDayBook():
   ├─ Query dc_day_book for previous day's closing
   ├─ Query dc_ledger_entries for date X transactions
   ├─ Calculate totals and category breakdowns
   ├─ INSERT into dc_day_book
   └─ INSERT into dc_day_book_details
   ↓
4. Return calculated data
```

### When Creating Ledger Entry:

```
1. User creates ledger entry
   ↓
2. INSERT into dc_ledger_entries
   ↓
3. UPDATE dc_ledger_accounts (current_balance)
   ↓
4. Background: updateDayBookOnEntry()
   ├─ Recalculate dc_day_book for that date
   ├─ Update dc_day_book_details
   └─ Cascade: Update next day's opening balance
```

---

## 📊 SQL Queries (What Actually Happens)

### Primary Query (Fast Path):
```sql
SELECT 
    db.*,
    details.transaction_type,
    details.category,
    details.subcategory,
    details.amount,
    details.transaction_count
FROM dc_day_book db
LEFT JOIN dc_day_book_details details 
    ON db.id = details.day_book_id
WHERE db.date = '2024-01-15'
  AND db.parent_membership_id = 123;
```

### Calculation Query (Fallback):
```sql
-- Get previous day's closing
SELECT closing_balance 
FROM dc_day_book 
WHERE date = '2024-01-14' 
  AND parent_membership_id = 123;

-- Get today's entries
SELECT category, subcategory, amount
FROM dc_ledger_entries
WHERE parent_membership_id = 123
  AND DATE(created_at) = '2024-01-15';
```

---

## 🎯 Summary

**Day Book displays data from:**

1. **Primary Source** (Fast):
   - ✅ `dc_day_book` - Daily totals
   - ✅ `dc_day_book_details` - Category breakdowns

2. **Calculation Source** (When not stored):
   - ⚠️ `dc_ledger_entries` - Transaction details
   - ⚠️ `dc_ledger_accounts` - Account balances
   - ⚠️ `dc_day_book` (previous day) - For opening balance

**Result**: 
- Fast performance (stored data)
- Always accurate (can recalculate if needed)
- Category-wise breakdowns available
- Auto-updates when entries are created





