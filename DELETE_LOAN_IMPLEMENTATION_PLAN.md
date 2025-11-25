# Delete Loan - Ledger & Day Book Cleanup Implementation Plan

## 📋 Overview

When deleting a loan via `DELETE /dc/loans/:id`, we need to:
1. ✅ Delete the loan (already implemented)
2. ❌ **Delete related ledger entries** (NOT implemented)
3. ❌ **Delete/Recalculate affected day book entries** (NOT implemented)
   - `dc_day_book` table (daily summary)
   - `dc_day_book_details` table (category breakdown)

---

## 🔍 Current State Analysis

### Frontend (Already Working)
- **File**: `treasure/src/context/dailyCollection/DailyCollectionContext.js`
- **Method**: `deleteLoan(loanId)` (Line 639-676)
- **Endpoint Called**: `DELETE /dc/loans/${loanId}`
- **Status**: ✅ Frontend correctly calls the backend API

### Backend (Needs Implementation)
- **Expected Location**: `treasure-service-main/src/controllers/dc/dcLoanController.js`
- **Method**: `deleteLoan` or `delete` method
- **Current Status**: Only deletes the loan, doesn't handle ledger entries or day book

---

## 🔗 Data Relationships

### How Loans Create Ledger Entries

When a loan is **disbursed**, it creates ledger entries with:
```javascript
{
  reference_type: 'loan',        // Links to loan
  reference_id: loan.id,         // The loan ID
  category: 'Loan Disbursement',
  subcategory: 'New Loan',
  amount: -principalAmount,       // Negative (money going out)
  payment_date: loanDisbursementDate
}
```

When **payments are made** on a loan, ledger entries are created with:
```javascript
{
  reference_type: 'loan',        // or 'receipt'
  reference_id: loan.id,         // The loan ID
  category: 'Collection',
  subcategory: 'Loan Payments',
  amount: paidAmount,           // Positive (money coming in)
  payment_date: paymentDate
}
```

### Database Tables Involved

1. **`dc_loan`** - The loan record (already being deleted)
2. **`dc_ledger_entries`** - Contains entries linked to loan via `reference_id` and `reference_type = 'loan'`
3. **`dc_day_book`** - Daily summary calculated from ledger entries
4. **`dc_day_book_details`** - Category breakdown calculated from ledger entries

---

## 🎯 Implementation Plan

### **Step 1: Update Backend Delete Loan Controller**

**File**: `treasure-service-main/src/controllers/dc/dcLoanController.js`

**Location**: Find the `deleteLoan` or `delete` method that handles `DELETE /dc/loans/:id`

#### Current Implementation (Expected):
```javascript
deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { membershipId } = req.body;
    
    // Find the loan
    const loan = await db.dcLoan.findOne({
      where: { id, parent_membership_id: membershipId }
    });
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    // Delete the loan (cascade will delete receivables and receipts)
    await loan.destroy();
    
    return res.json({ success: true, message: 'Loan deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
```

#### Updated Implementation (With Ledger & Day Book Cleanup):
```javascript
deleteLoan = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { membershipId } = req.body;
    
    // Step 1: Find the loan
    const loan = await db.dcLoan.findOne({
      where: { id, parent_membership_id: membershipId },
      transaction
    });
    
    if (!loan) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    // Step 2: Get all payment dates from ledger entries before deletion
    // (We need these to recalculate day book for affected dates)
    const ledgerEntries = await db.dcLedgerEntry.findAll({
      where: {
        reference_id: id,
        reference_type: 'loan',  // or 'LOAN' - check your actual value
        parent_membership_id: membershipId
      },
      attributes: ['payment_date'],
      transaction
    });
    
    // Extract unique payment dates
    const affectedDates = [...new Set(
      ledgerEntries.map(entry => entry.payment_date?.toISOString().split('T')[0])
    )].filter(Boolean);
    
    // Step 3: Delete all ledger entries related to this loan
    const deletedEntriesCount = await db.dcLedgerEntry.destroy({
      where: {
        reference_id: id,
        reference_type: 'loan',  // or 'LOAN' - check your actual value
        parent_membership_id: membershipId
      },
      transaction
    });
    
    // Step 4: Delete day book records for affected dates (within transaction)
    // Must delete dc_day_book_details FIRST (foreign key constraint)
    if (affectedDates.length > 0) {
      // Find day book IDs for affected dates
      const dayBooks = await db.dcDayBook.findAll({
        where: {
          date: { [db.Sequelize.Op.in]: affectedDates },
          parent_membership_id: membershipId
        },
        attributes: ['id'],
        transaction
      });
      
      const dayBookIds = dayBooks.map(db => db.id);
      
      if (dayBookIds.length > 0) {
        // Delete day book details first (has foreign key to dc_day_book)
        await db.dcDayBookDetails.destroy({
          where: {
            day_book_id: { [db.Sequelize.Op.in]: dayBookIds }
          },
          transaction
        });
        
        // Delete day book records
        await db.dcDayBook.destroy({
          where: {
            id: { [db.Sequelize.Op.in]: dayBookIds }
          },
          transaction
        });
      }
    }
    
    // Step 5: Delete the loan (cascade will delete receivables and receipts)
    await loan.destroy({ transaction });
    
    // Commit transaction
    await transaction.commit();
    
    // Step 6: Recalculate day book forward from earliest affected date (background)
    // This cascades forward all subsequent dates' opening and closing balances
    if (affectedDates.length > 0) {
      const earliestDate = affectedDates.sort()[0]; // Get earliest date for cascade
      
      // Run in background (non-blocking)
      setImmediate(async () => {
        try {
          const dcLedgerController = require('./dcLedgerController');
          // Use cascade forward to recalculate from earliest date onward
          await dcLedgerController.recalculateDayBookForward(membershipId, earliestDate);
        } catch (error) {
          console.error('Error recalculating day book forward after loan deletion:', error);
          // Log but don't fail the request
        }
      });
    }
    
    return res.json({ 
      success: true, 
      message: 'Loan deleted successfully',
      deletedLedgerEntries: deletedEntriesCount,
      affectedDates: affectedDates.length,
      dayBookRecalculated: affectedDates.length > 0
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting loan:', error);
    return res.status(500).json({ 
      message: 'Failed to delete loan',
      error: error.message 
    });
  }
};
```

---

### **Step 2: Verify Reference Type Value**

**Action Required**: Check what value is actually used for `reference_type` when creating loan-related ledger entries.

**Possible Values**:
- `'loan'` (lowercase)
- `'LOAN'` (uppercase)
- `'Loan'` (capitalized)
- `'dc_loan'` (with prefix)

**How to Check**:
1. Look at the loan disbursement code in `dcLoanController.js` (disburse method)
2. Check what value is set for `reference_type` when creating ledger entries
3. Use the same value in the delete method

**Example Check**:
```javascript
// In disburse method, find where ledger entry is created:
await db.dcLedgerEntry.create({
  // ...
  reference_type: 'loan',  // ← This is the value to use
  reference_id: loan.id,
  // ...
});
```

---

### **Step 3: Access Day Book Calculation Method**

**File**: `treasure-service-main/src/controllers/dc/dcLedgerController.js`

**Method Needed**: `calculateAndStoreDayBook(membershipId, date)`

**If Method Doesn't Exist**, you'll need to:
1. Check if there's a similar method with a different name
2. Or implement a helper function to recalculate day book

**Alternative Approach** (if method doesn't exist):
```javascript
// Instead of calling calculateAndStoreDayBook, you can:
// 1. Delete day book records for affected dates
// 2. They will be recalculated on-demand when viewed

// Delete day book details first (foreign key constraint)
await db.dcDayBookDetails.destroy({
  where: {
    day_book_id: {
      [db.Sequelize.Op.in]: db.sequelize.literal(
        `(SELECT id FROM dc_day_book WHERE date IN (${affectedDates.map(d => `'${d}'`).join(',')}) AND parent_membership_id = ${membershipId})`
      )
    }
  }
});

// Delete day book records
await db.dcDayBook.destroy({
  where: {
    date: { [db.Sequelize.Op.in]: affectedDates },
    parent_membership_id: membershipId
  }
});
```

---

### **Step 4: Handle Ledger Account Balance Updates**

**Important**: When deleting ledger entries, you may need to update the ledger account balances.

**Check**: Does your system automatically update account balances when entries are deleted?

**If Not**, add this after deleting ledger entries:
```javascript
// After deleting ledger entries, recalculate account balances
const accounts = await db.dcLedgerAccount.findAll({
  where: { parent_membership_id: membershipId },
  transaction
});

for (const account of accounts) {
  // Recalculate balance from remaining entries
  const balanceResult = await db.dcLedgerEntry.findOne({
    where: {
      dc_ledger_accounts_id: account.id,
      parent_membership_id: membershipId
    },
    attributes: [
      [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total']
    ],
    raw: true,
    transaction
  });
  
  const newBalance = parseFloat(balanceResult?.total || 0) + parseFloat(account.opening_balance || 0);
  
  await account.update({
    current_balance: newBalance
  }, { transaction });
}
```

---

## 📝 Implementation Checklist

### Backend Changes

- [ ] **Step 1**: Locate `deleteLoan` method in `dcLoanController.js`
- [ ] **Step 2**: Verify `reference_type` value used for loans (check disburse method)
- [ ] **Step 3**: Add code to find all ledger entries with `reference_id = loan.id` and `reference_type = 'loan'`
- [ ] **Step 4**: Extract unique `payment_date` values from found entries
- [ ] **Step 5**: Delete all related ledger entries within transaction
- [ ] **Step 6**: Delete the loan (within same transaction)
- [ ] **Step 7**: Commit transaction
- [ ] **Step 8**: Recalculate day book for affected dates (in background)
- [ ] **Step 9**: (Optional) Update ledger account balances if needed
- [ ] **Step 10**: Test the implementation

### Testing Checklist

- [ ] **Test 1**: Delete a loan with no payments (only disbursement entry)
  - Verify: Ledger entry deleted
  - Verify: Day book recalculated for disbursement date
  
- [ ] **Test 2**: Delete a loan with payments
  - Verify: All ledger entries (disbursement + payments) deleted
  - Verify: Day book recalculated for all affected dates
  
- [ ] **Test 3**: Delete a loan that doesn't exist
  - Verify: Returns 404 error
  
- [ ] **Test 4**: Delete a loan with multiple payments on same date
  - Verify: Day book recalculated correctly (no duplicates)
  
- [ ] **Test 5**: Verify day book shows correct balances after deletion
  - Check: Opening/closing balances are correct
  - Check: Category breakdown is correct

---

## 🔧 Alternative Implementation (Simpler Approach)

If the day book recalculation method is complex or doesn't exist, you can use a simpler approach:

### Option A: Delete Day Book Records (Let them recalculate on-demand)

```javascript
// After deleting ledger entries, delete day book records
// They will be recalculated automatically when viewed

// Get affected dates
const affectedDates = [...new Set(ledgerEntries.map(e => e.payment_date))];

// Delete day book details (must delete first due to foreign key)
await db.dcDayBookDetails.destroy({
  where: {
    day_book_id: {
      [db.Sequelize.Op.in]: db.sequelize.literal(
        `(SELECT id FROM dc_day_book WHERE date IN (${affectedDates.map(d => `'${d}'`).join(',')}) AND parent_membership_id = ${membershipId})`
      )
    }
  }
});

// Delete day book records
await db.dcDayBook.destroy({
  where: {
    date: { [db.Sequelize.Op.in]: affectedDates },
    parent_membership_id: membershipId
  }
});
```

### Option B: Recalculate Day Book Immediately (Blocking)

```javascript
// Recalculate immediately (blocks response until complete)
const dcLedgerController = require('./dcLedgerController');
for (const date of affectedDates) {
  await dcLedgerController.calculateAndStoreDayBook(membershipId, date);
}
```

**Recommendation**: Use **Option A** (delete and recalculate on-demand) for better performance, or **Background recalculation** (setImmediate) for immediate updates without blocking.

---

## 🚨 Important Notes

1. **Transaction Safety**: Always use database transactions when deleting related records
2. **Reference Type**: Verify the exact value of `reference_type` used in your system
3. **Cascade Deletes**: Check if `dc_receivable` and `dc_receipt` have cascade deletes (they should)
4. **Day Book Recalculation**: Use **cascade forward** approach to recalculate from earliest affected date onward
   - This ensures all subsequent days' opening and closing balances are updated correctly
   - See `DAY_BOOK_CASCADE_FORWARD_IMPLEMENTATION.md` for detailed implementation
5. **Error Handling**: Ensure proper error handling and rollback on failures
6. **Performance**: Background recalculation is recommended for better user experience
7. **Cascade Forward**: When deleting a transaction on date X, recalculate day book for date X and all dates after X

---

## 📍 File Locations

### Backend Files to Modify:
- **Primary**: `treasure-service-main/src/controllers/dc/dcLoanController.js`
- **Helper**: `treasure-service-main/src/controllers/dc/dcLedgerController.js` (for day book recalculation)
- **Models**: `treasure-service-main/src/models/` (verify model names)

### Frontend Files (No Changes Needed):
- ✅ `treasure/src/context/dailyCollection/DailyCollectionContext.js` (already correct)

---

## 🎯 Expected Outcome

After implementation:
1. ✅ Loan is deleted
2. ✅ All related ledger entries are deleted
3. ✅ Day book is recalculated for affected dates
4. ✅ Ledger account balances are updated (if applicable)
5. ✅ User sees accurate data in day book after deletion

---

## 📞 Next Steps

1. **Access Backend Code**: Navigate to the backend path mentioned
2. **Locate Delete Method**: Find the `deleteLoan` method in `dcLoanController.js`
3. **Verify Reference Type**: Check what value is used for `reference_type`
4. **Implement Changes**: Follow the implementation plan above
5. **Test Thoroughly**: Use the testing checklist
6. **Deploy**: Deploy to staging/test environment first

---

## 🔍 Debugging Tips

If issues occur:

1. **Check Logs**: Look for errors in transaction rollback
2. **Verify Reference Type**: Use SQL query to check actual values:
   ```sql
   SELECT DISTINCT reference_type 
   FROM dc_ledger_entries 
   WHERE reference_id = 'loan-id-here';
   ```
3. **Check Day Book**: Verify day book records exist before deletion:
   ```sql
   SELECT * FROM dc_day_book 
   WHERE date IN ('2024-01-15', '2024-01-16') 
   AND parent_membership_id = 1;
   ```
4. **Test Incrementally**: Test each step separately before combining

---

**Implementation Date**: ___________  
**Implemented By**: ___________  
**Tested By**: ___________  
**Status**: ⏳ Pending Implementation

