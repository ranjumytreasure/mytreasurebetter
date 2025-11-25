# Day Book Cascade Forward Implementation Plan

## 📋 Overview

When transactions are added, deleted, or modified, we need to:
1. **Recalculate the affected date's day book**
2. **Cascade forward** all subsequent days' opening and closing balances

This ensures data integrity and historical accuracy.

---

## 🎯 Two Cases to Handle

### **Case 1: Delete Loan Transaction**

**Scenario**: Delete a transaction (e.g., outflow of ₹1000 on 2025-11-13)

**Impact**:
- Closing balance for 13-Nov changes (increases by ₹1000)
- Opening balance for all future days (14-Nov, 15-Nov...) must also change

**Solution**: Recalculate forward from deletion date

---

### **Case 2: Add/Edit Transaction with Payment Date**

**Scenario**: Add transaction with `payment_date = 2025-11-13` (effective date)

**Impact**:
- Totals of 2025-11-13 change
- Closing balance of 2025-11-13 changes
- All subsequent days' balances must shift

**Solution**: Cascade forward adjustment from payment date

---

## 🔧 Implementation Strategy

### **Core Function: `recalculateDayBookForward`**

This function will:
1. Recalculate day book for a specific date
2. Cascade forward all subsequent dates

---

## 📝 Implementation Code

### **Step 1: Create Cascade Forward Function**

**File**: `treasure-service-main/src/controllers/dc/dcLedgerController.js`

```javascript
/**
 * Recalculate day book for a specific date and cascade forward all subsequent dates
 * @param {number} membershipId - Membership ID
 * @param {string} startDate - Date to start recalculation from (YYYY-MM-DD)
 */
recalculateDayBookForward = async (membershipId, startDate) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    // Step 1: Recalculate the start date
    await this.calculateAndStoreDayBook(membershipId, startDate, transaction);
    
    // Step 2: Get all subsequent dates that have day book records
    const subsequentDayBooks = await db.dcDayBook.findAll({
      where: {
        parent_membership_id: membershipId,
        date: {
          [db.Sequelize.Op.gt]: startDate
        }
      },
      order: [['date', 'ASC']],
      transaction
    });
    
    // Step 3: For each subsequent date, recalculate using previous day's closing
    for (const dayBook of subsequentDayBooks) {
      const currentDate = dayBook.date.toISOString().split('T')[0];
      
      // Get previous day's closing balance
      const previousDate = new Date(dayBook.date);
      previousDate.setDate(previousDate.getDate() - 1);
      const prevDateStr = previousDate.toISOString().split('T')[0];
      
      const previousDayBook = await db.dcDayBook.findOne({
        where: {
          parent_membership_id: membershipId,
          date: prevDateStr
        },
        transaction
      });
      
      // If previous day exists, use its closing balance as opening
      // Otherwise, calculate from accounts
      let openingBalance;
      if (previousDayBook) {
        openingBalance = parseFloat(previousDayBook.closing_balance || 0);
      } else {
        openingBalance = await this.calculatePreviousDayClosing(membershipId, currentDate);
      }
      
      // Get ledger entries for this date (using payment_date)
      const entries = await db.dcLedgerEntry.findAll({
        where: {
          parent_membership_id: membershipId,
          payment_date: currentDate,
          deleted_at: null
        },
        transaction
      });
      
      // Calculate totals
      let totalReceived = 0;
      let totalSpent = 0;
      const categoryMap = {};
      
      entries.forEach(entry => {
        const amount = parseFloat(entry.amount || 0);
        const isCollection = entry.category === 'Collection' || entry.category === 'Income';
        
        if (isCollection) {
          totalReceived += amount;
        } else {
          totalSpent += Math.abs(amount); // Ensure positive for spent
        }
        
        // Group by category + subcategory for details
        const key = `${isCollection ? 'COLLECTION' : 'EXPENSE'}_${entry.category}_${entry.subcategory || ''}`;
        if (!categoryMap[key]) {
          categoryMap[key] = {
            transaction_type: isCollection ? 'COLLECTION' : 'EXPENSE',
            category: entry.category,
            subcategory: entry.subcategory || null,
            amount: 0,
            count: 0
          };
        }
        categoryMap[key].amount += Math.abs(amount);
        categoryMap[key].count += 1;
      });
      
      // Calculate closing balance
      const closingBalance = openingBalance + totalReceived - totalSpent;
      
      // Update day book record
      await dayBook.update({
        opening_balance: openingBalance,
        closing_balance: closingBalance,
        total_received: totalReceived,
        total_spent: totalSpent,
        last_updated_at: new Date()
      }, { transaction });
      
      // Delete old details and create new ones
      await db.dcDayBookDetails.destroy({
        where: {
          day_book_id: dayBook.id
        },
        transaction
      });
      
      // Create new details
      for (const detail of Object.values(categoryMap)) {
        await db.dcDayBookDetails.create({
          day_book_id: dayBook.id,
          transaction_type: detail.transaction_type,
          category: detail.category,
          subcategory: detail.subcategory,
          amount: detail.amount,
          transaction_count: detail.count
        }, { transaction });
      }
    }
    
    await transaction.commit();
    console.log(`✅ Recalculated day book forward from ${startDate}`);
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error in recalculateDayBookForward:', error);
    throw error;
  }
};
```

---

### **Step 2: Update Delete Loan Method**

**File**: `treasure-service-main/src/controllers/dc/dcLoanController.js`

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
    
    // Step 2: Get all ledger entries (to extract affected dates)
    const ledgerEntries = await db.dcLedgerEntry.findAll({
      where: {
        reference_id: id,
        reference_type: 'loan',  // ⚠️ Verify actual value
        parent_membership_id: membershipId
      },
      attributes: ['payment_date'],
      transaction
    });
    
    // Step 3: Extract unique payment dates and find earliest date
    const affectedDates = [...new Set(
      ledgerEntries.map(entry => entry.payment_date?.toISOString().split('T')[0])
    )].filter(Boolean);
    
    const earliestDate = affectedDates.length > 0 
      ? affectedDates.sort()[0]  // Get earliest date for cascade
      : null;
    
    // Step 4: Delete day book records for affected dates (within transaction)
    if (affectedDates.length > 0) {
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
        // Delete day book details first (foreign key)
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
    
    // Step 5: Delete ledger entries
    const deletedEntriesCount = await db.dcLedgerEntry.destroy({
      where: {
        reference_id: id,
        reference_type: 'loan',
        parent_membership_id: membershipId
      },
      transaction
    });
    
    // Step 6: Delete the loan
    await loan.destroy({ transaction });
    
    // Commit transaction
    await transaction.commit();
    
    // Step 7: Recalculate day book forward from earliest affected date (background)
    if (earliestDate) {
      setImmediate(async () => {
        try {
          const dcLedgerController = require('./dcLedgerController');
          await dcLedgerController.recalculateDayBookForward(membershipId, earliestDate);
        } catch (error) {
          console.error('Error recalculating day book forward after loan deletion:', error);
        }
      });
    }
    
    return res.json({ 
      success: true, 
      message: 'Loan deleted successfully',
      deletedLedgerEntries: deletedEntriesCount,
      affectedDates: affectedDates.length,
      cascadeFromDate: earliestDate
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

### **Step 3: Update Create/Edit Ledger Entry Method**

**File**: `treasure-service-main/src/controllers/dc/dcLedgerController.js`

```javascript
createLedgerEntry = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { membershipId, payment_date, ...entryData } = req.body;
    
    // Step 1: Create ledger entry
    const entry = await db.dcLedgerEntry.create({
      ...entryData,
      payment_date: payment_date || new Date().toISOString().split('T')[0],
      parent_membership_id: membershipId
    }, { transaction });
    
    // Step 2: Update ledger account balance
    if (entry.dc_ledger_accounts_id) {
      const account = await db.dcLedgerAccount.findByPk(entry.dc_ledger_accounts_id, { transaction });
      if (account) {
        const newBalance = parseFloat(account.current_balance || 0) + parseFloat(entry.amount || 0);
        await account.update({ current_balance: newBalance }, { transaction });
      }
    }
    
    await transaction.commit();
    
    // Step 3: Recalculate day book forward from payment_date (background)
    const effectiveDate = payment_date || new Date().toISOString().split('T')[0];
    setImmediate(async () => {
      try {
        await this.recalculateDayBookForward(membershipId, effectiveDate);
      } catch (error) {
        console.error('Error recalculating day book forward after entry creation:', error);
      }
    });
    
    return res.json({ 
      success: true, 
      message: 'Ledger entry created successfully',
      results: entry 
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating ledger entry:', error);
    return res.status(500).json({ 
      message: 'Failed to create ledger entry',
      error: error.message 
    });
  }
};

updateLedgerEntry = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { membershipId, payment_date, ...updateData } = req.body;
    
    // Step 1: Get old entry to find old payment_date
    const oldEntry = await db.dcLedgerEntry.findOne({
      where: { id, parent_membership_id: membershipId },
      transaction
    });
    
    if (!oldEntry) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Ledger entry not found' });
    }
    
    const oldPaymentDate = oldEntry.payment_date?.toISOString().split('T')[0];
    const newPaymentDate = payment_date || oldPaymentDate || new Date().toISOString().split('T')[0];
    
    // Step 2: Update entry
    await oldEntry.update({
      ...updateData,
      payment_date: newPaymentDate
    }, { transaction });
    
    // Step 3: Update account balance if amount changed
    if (updateData.amount && oldEntry.dc_ledger_accounts_id) {
      const account = await db.dcLedgerAccount.findByPk(oldEntry.dc_ledger_accounts_id, { transaction });
      if (account) {
        const balanceChange = parseFloat(updateData.amount) - parseFloat(oldEntry.amount || 0);
        const newBalance = parseFloat(account.current_balance || 0) + balanceChange;
        await account.update({ current_balance: newBalance }, { transaction });
      }
    }
    
    await transaction.commit();
    
    // Step 4: Recalculate day book forward from earliest affected date
    const datesToRecalculate = [oldPaymentDate, newPaymentDate].filter(Boolean);
    const earliestDate = datesToRecalculate.sort()[0];
    
    if (earliestDate) {
      setImmediate(async () => {
        try {
          await this.recalculateDayBookForward(membershipId, earliestDate);
        } catch (error) {
          console.error('Error recalculating day book forward after entry update:', error);
        }
      });
    }
    
    return res.json({ 
      success: true, 
      message: 'Ledger entry updated successfully',
      results: await db.dcLedgerEntry.findByPk(id)
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating ledger entry:', error);
    return res.status(500).json({ 
      message: 'Failed to update ledger entry',
      error: error.message 
    });
  }
};

deleteLedgerEntry = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { membershipId } = req.body;
    
    // Step 1: Get entry to find payment_date
    const entry = await db.dcLedgerEntry.findOne({
      where: { id, parent_membership_id: membershipId },
      transaction
    });
    
    if (!entry) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Ledger entry not found' });
    }
    
    const paymentDate = entry.payment_date?.toISOString().split('T')[0];
    
    // Step 2: Update account balance
    if (entry.dc_ledger_accounts_id) {
      const account = await db.dcLedgerAccount.findByPk(entry.dc_ledger_accounts_id, { transaction });
      if (account) {
        const newBalance = parseFloat(account.current_balance || 0) - parseFloat(entry.amount || 0);
        await account.update({ current_balance: newBalance }, { transaction });
      }
    }
    
    // Step 3: Delete day book for this date
    if (paymentDate) {
      const dayBook = await db.dcDayBook.findOne({
        where: {
          date: paymentDate,
          parent_membership_id: membershipId
        },
        transaction
      });
      
      if (dayBook) {
        await db.dcDayBookDetails.destroy({
          where: { day_book_id: dayBook.id },
          transaction
        });
        await dayBook.destroy({ transaction });
      }
    }
    
    // Step 4: Delete ledger entry
    await entry.destroy({ transaction });
    
    await transaction.commit();
    
    // Step 5: Recalculate day book forward from payment_date
    if (paymentDate) {
      setImmediate(async () => {
        try {
          await this.recalculateDayBookForward(membershipId, paymentDate);
        } catch (error) {
          console.error('Error recalculating day book forward after entry deletion:', error);
        }
      });
    }
    
    return res.json({ 
      success: true, 
      message: 'Ledger entry deleted successfully'
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting ledger entry:', error);
    return res.status(500).json({ 
      message: 'Failed to delete ledger entry',
      error: error.message 
    });
  }
};
```

---

## 🔍 Key Points

### **1. Payment Date is the Effective Date**

- Always use `payment_date` from ledger entries (not `created_at`)
- This is the date that affects day book calculations

### **2. Cascade Forward Logic**

- When a date changes, recalculate that date
- Then recalculate all subsequent dates in order
- Each date's opening balance = previous date's closing balance

### **3. Transaction Safety**

- Use database transactions for data integrity
- Run cascade recalculation in background (non-blocking)

### **4. Performance Considerations**

- Only recalculate dates that have day book records
- Process dates in chronological order
- Use background processing to avoid blocking API responses

---

## 📋 Testing Checklist

### **Case 1: Delete Loan Transaction**

- [ ] Delete loan with disbursement on 2025-11-13
- [ ] Verify day book for 2025-11-13 recalculated
- [ ] Verify closing balance for 2025-11-13 increased
- [ ] Verify opening balance for 2025-11-14 updated
- [ ] Verify all subsequent dates' balances updated

### **Case 2: Add Transaction with Payment Date**

- [ ] Add transaction with payment_date = 2025-11-13
- [ ] Verify day book for 2025-11-13 updated
- [ ] Verify closing balance for 2025-11-13 changed
- [ ] Verify opening balance for 2025-11-14 updated
- [ ] Verify all subsequent dates' balances updated

### **Case 3: Edit Transaction Payment Date**

- [ ] Change payment_date from 2025-11-13 to 2025-11-15
- [ ] Verify day book for 2025-11-13 recalculated (removed)
- [ ] Verify day book for 2025-11-15 recalculated (added)
- [ ] Verify all dates between and after updated

### **Case 4: Delete Ledger Entry**

- [ ] Delete entry with payment_date = 2025-11-13
- [ ] Verify day book for 2025-11-13 recalculated
- [ ] Verify all subsequent dates' balances updated

---

## 🚨 Important Notes

1. **Always use `payment_date`** for day book calculations (not `created_at`)
2. **Cascade forward** from the earliest affected date
3. **Background processing** to avoid blocking API responses
4. **Transaction safety** for data integrity
5. **Chronological order** when processing multiple dates

---

## 📍 File Locations

### Backend Files to Modify:
- **Primary**: `treasure-service-main/src/controllers/dc/dcLedgerController.js`
  - Add `recalculateDayBookForward` method
  - Update `createLedgerEntry` method
  - Update `updateLedgerEntry` method
  - Add `deleteLedgerEntry` method
  
- **Secondary**: `treasure-service-main/src/controllers/dc/dcLoanController.js`
  - Update `deleteLoan` method to use cascade forward

---

## 🎯 Expected Outcome

After implementation:
1. ✅ Day book recalculates correctly when transactions are added/deleted/edited
2. ✅ All subsequent dates' balances cascade forward automatically
3. ✅ Historical integrity maintained
4. ✅ No blocking of API responses (background processing)
5. ✅ Data consistency across all dates

---

**Implementation Date**: ___________  
**Implemented By**: ___________  
**Tested By**: ___________  
**Status**: ⏳ Pending Implementation



