# Backend Implementation: Payment Date for Day Book Calculation

## Overview

The day book calculation needs to use `payment_date` instead of `created_at` to accurately reflect when payments were actually made, not when the system recorded them.

## Database Changes

Run the SQL migration file: `ADD_PAYMENT_DATE_TO_LEDGER_ENTRIES.sql`

This adds:
- `payment_date` DATE column to `dc_ledger_entries` table
- Index on `payment_date` for better query performance
- Backfills existing records with `DATE(created_at)` as fallback

## Backend API Changes Required

### 1. Update Ledger Entry Creation Endpoint

**File**: `routes/dc/ledger.js` or similar
**Endpoint**: `POST /dc/ledger/entries`

#### Current Request Body:
```json
{
  "dc_ledger_accounts_id": 1,
  "category": "Collection",
  "subcategory": "Loan Payments",
  "amount": 5000.00,
  "description": "Payment received",
  "reference_id": "123",
  "reference_type": "receipt",
  "membershipId": 123
}
```

#### Updated Request Body (Add payment_date):
```json
{
  "dc_ledger_accounts_id": 1,
  "category": "Collection",
  "subcategory": "Loan Payments",
  "amount": 5000.00,
  "description": "Payment received",
  "reference_id": "123",
  "reference_type": "receipt",
  "payment_date": "2024-01-15",  // NEW FIELD
  "membershipId": 123
}
```

#### Backend Code Update:
```javascript
// In ledger entry controller
async create(req, res) {
  const {
    dc_ledger_accounts_id,
    category,
    subcategory,
    amount,
    description,
    reference_id,
    reference_type,
    payment_date,  // NEW: Accept payment_date
    membershipId
  } = req.body;

  // Validate payment_date if provided
  const paymentDate = payment_date || new Date().toISOString().split('T')[0];

  const entry = await dcLedgerEntry.create({
    dc_ledger_accounts_id,
    category,
    subcategory,
    amount,
    description,
    reference_id,
    reference_type,
    payment_date: paymentDate,  // NEW: Store payment_date
    parent_membership_id: membershipId,
    // created_at will be set automatically by database
  });

  return res.json({ success: true, results: entry });
}
```

### 2. Update Loan Disbursement Endpoint

**File**: `controllers/dc/dcLoanController.js` or similar
**Endpoint**: `POST /dc/loans/disburse`

When creating a ledger entry for loan disbursement, use `loanDisbursementDate` as `payment_date`:

```javascript
async disburse(req, res) {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      subscriberId,
      productId,
      principalAmount,
      loanDisbursementDate,  // This should be used as payment_date
      // ... other fields
    } = req.body;

    // ... existing loan creation code ...

    // Create ledger entry for loan disbursement
    await dcLedgerEntry.create({
      dc_ledger_accounts_id: accountId,  // From paymentMethod
      category: 'Loan Disbursement',
      subcategory: 'New Loan',
      amount: -principalAmount,  // Negative for disbursement
      description: `Loan disbursement for subscriber ${subscriberId}`,
      reference_id: loan.id,
      reference_type: 'loan',
      payment_date: loanDisbursementDate,  // USE LOAN DISBURSEMENT DATE
      parent_membership_id: membershipId,
    }, { transaction });

    // ... rest of the code ...

    await transaction.commit();
    return res.json({ success: true, data: loan });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

### 3. Update Receipt/Payment Endpoint

**File**: `controllers/dc/dcReceiptController.js` or similar
**Endpoint**: `POST /dc/collections/pay` or `POST /dc/receipts`

When creating a ledger entry for collection/payment, use `payment_date` from `dc_receipt`:

```javascript
async create(req, res) {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      receivableId,
      amount,
      paymentMethod,
      paymentDate,  // This should be used as payment_date
      notes,
      membershipId
    } = req.body;

    // ... existing receipt creation code ...

    // Create receipt
    const receipt = await dcReceipt.create({
      receivable_id: receivableId,
      paid_amount: amount,
      payment_date: paymentDate,
      mode: paymentMethod,
      remarks: notes,
      parent_membership_id: membershipId,
    }, { transaction });

    // Create ledger entry for collection
    await dcLedgerEntry.create({
      dc_ledger_accounts_id: accountId,  // From paymentMethod
      category: 'Collection',
      subcategory: 'Loan Payments',
      amount: amount,
      description: `Payment received for receivable ${receivableId}`,
      reference_id: receipt.id,
      reference_type: 'receipt',
      payment_date: paymentDate,  // USE PAYMENT DATE FROM RECEIPT
      parent_membership_id: membershipId,
    }, { transaction });

    // ... rest of the code ...

    await transaction.commit();
    return res.json({ success: true, results: receipt });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

### 4. Update Day Book Calculation Endpoint

**File**: `controllers/dc/dcLedgerController.js` or similar
**Endpoint**: `GET /dc/ledger/day-book`

**CRITICAL CHANGE**: Use `payment_date` instead of `created_at` for date filtering:

#### Before (WRONG):
```javascript
// OLD CODE - Using created_at
const collections = await dcLedgerEntry.findAll({
  where: {
    parent_membership_id: membershipId,
    [Op.and]: [
      sequelize.where(sequelize.fn('DATE', sequelize.col('created_at')), selectedDate),
      { category: { [Op.in]: ['Collection', 'Income'] } }
    ]
  }
});
```

#### After (CORRECT):
```javascript
// NEW CODE - Using payment_date
const collections = await dcLedgerEntry.findAll({
  where: {
    parent_membership_id: membershipId,
    payment_date: selectedDate,  // Use payment_date directly
    category: { [Op.in]: ['Collection', 'Income'] }
  }
});

const expenses = await dcLedgerEntry.findAll({
  where: {
    parent_membership_id: membershipId,
    payment_date: selectedDate,  // Use payment_date directly
    category: { [Op.in]: ['Loan Disbursement', 'Expense'] }
  }
});
```

#### Complete Day Book Calculation Example:
```javascript
async getDayBook(req, res) {
  try {
    const { parent_membership_id, date } = req.query;
    const selectedDate = date || new Date().toISOString().split('T')[0];
    
    // Calculate previous day's closing balance
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);
    const previousDateStr = previousDate.toISOString().split('T')[0];

    // Get opening balance (previous day's closing)
    const openingBalance = await calculateClosingBalance(
      parent_membership_id, 
      previousDateStr
    );

    // Get collections for selected date (using payment_date)
    const collections = await dcLedgerEntry.findAll({
      where: {
        parent_membership_id: parent_membership_id,
        payment_date: selectedDate,  // KEY CHANGE: Use payment_date
        category: { [Op.in]: ['Collection', 'Income'] }
      }
    });

    // Get expenses for selected date (using payment_date)
    const expenses = await dcLedgerEntry.findAll({
      where: {
        parent_membership_id: parent_membership_id,
        payment_date: selectedDate,  // KEY CHANGE: Use payment_date
        category: { [Op.in]: ['Loan Disbursement', 'Expense'] }
      }
    });

    // Calculate totals
    const totalReceived = collections.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
    const totalSpent = expenses.reduce((sum, e) => sum + Math.abs(parseFloat(e.amount || 0)), 0);

    // Calculate closing balance
    const closingBalance = openingBalance + totalReceived - totalSpent;

    // Group by category
    const collectionsByCategory = groupByCategory(collections);
    const expensesByCategory = groupByCategory(expenses);

    return res.json({
      success: true,
      results: {
        date: selectedDate,
        opening_balance: openingBalance,
        closing_balance: closingBalance,
        total_received: totalReceived,
        total_spent: totalSpent,
        collections_by_category: collectionsByCategory,
        expenses_by_category: expensesByCategory
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Helper function to calculate closing balance for a specific date
async function calculateClosingBalance(membershipId, date) {
  // Get all accounts
  const accounts = await dcLedgerAccount.findAll({
    where: { parent_membership_id: membershipId }
  });

  let totalBalance = 0;

  for (const account of accounts) {
    // Get all entries up to and including the specified date (using payment_date)
    const entries = await dcLedgerEntry.findAll({
      where: {
        dc_ledger_accounts_id: account.id,
        payment_date: { [Op.lte]: date }  // KEY CHANGE: Use payment_date
      },
      order: [['payment_date', 'ASC']]
    });

    // Calculate account balance
    const accountBalance = entries.reduce(
      (sum, entry) => sum + parseFloat(entry.amount || 0),
      parseFloat(account.opening_balance || 0)
    );

    totalBalance += accountBalance;
  }

  return totalBalance;
}

// Helper function to group entries by category
function groupByCategory(entries) {
  const grouped = {};
  
  entries.forEach(entry => {
    const key = `${entry.category}_${entry.subcategory || ''}`;
    if (!grouped[key]) {
      grouped[key] = {
        category: entry.category,
        subcategory: entry.subcategory || null,
        amount: 0,
        transaction_count: 0
      };
    }
    grouped[key].amount += parseFloat(entry.amount || 0);
    grouped[key].transaction_count += 1;
  });

  return Object.values(grouped);
}
```

## Database Model Update

**File**: `models/dcLedgerEntry.js` or similar

Update the model to include `payment_date` field:

```javascript
// Sequelize model example
dcLedgerEntry.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dc_ledger_accounts_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'dc_ledger_accounts',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reference_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reference_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payment_date: {  // NEW FIELD
    type: DataTypes.DATEONLY,  // DATE type (no time)
    allowNull: false
  },
  parent_membership_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'membership',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'dcLedgerEntry',
  tableName: 'dc_ledger_entries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
```

## Summary of Changes

1. ✅ **Database**: Add `payment_date` column to `dc_ledger_entries`
2. ✅ **Ledger Entry Creation**: Accept and store `payment_date`
3. ✅ **Loan Disbursement**: Use `loanDisbursementDate` as `payment_date`
4. ✅ **Receipt/Payment**: Use `paymentDate` from receipt as `payment_date`
5. ✅ **Day Book Calculation**: Use `payment_date` instead of `DATE(created_at)` for filtering

## Testing Checklist

- [ ] Run SQL migration successfully
- [ ] Create manual ledger entry with `payment_date`
- [ ] Disburse loan and verify ledger entry uses `loanDisbursementDate`
- [ ] Record payment and verify ledger entry uses `paymentDate`
- [ ] Verify day book calculation uses `payment_date` correctly
- [ ] Test with different dates to ensure day book shows correct transactions
- [ ] Verify existing records have `payment_date` backfilled

## Rollback Plan

If needed, you can rollback by:
1. Update day book calculation to use `DATE(created_at)` again
2. The `payment_date` column can remain (it won't break existing functionality)
3. Gradually migrate entries to use proper `payment_date` values

---

**Important**: After implementing these changes, the day book will accurately reflect payments based on the customer's chosen payment date, not the system recording timestamp.

