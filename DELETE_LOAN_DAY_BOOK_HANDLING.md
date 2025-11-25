# Delete Loan - Day Book Tables Handling

## 📋 Overview

When deleting a loan, you must handle **both day book tables**:
1. **`dc_day_book`** - Daily summary (one row per day)
2. **`dc_day_book_details`** - Category breakdown (multiple rows per day, linked via `day_book_id`)

---

## 🔗 Table Relationship

```
dc_day_book (1 row per day)
  └── dc_day_book_details (multiple rows per day)
       └── day_book_id (Foreign Key → dc_day_book.id)
```

**Important**: `dc_day_book_details` has a foreign key to `dc_day_book`, so you must delete details **FIRST**.

---

## 🎯 Two Approaches

### **Approach 1: Delete + Recalculate (Recommended)**

Delete existing day book records and recalculate from remaining ledger entries.

**Steps**:
1. Delete `dc_day_book_details` (must delete first)
2. Delete `dc_day_book`
3. Recalculate day book from remaining ledger entries

**Code**:
```javascript
// Step 1: Find day book IDs for affected dates
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
  // Step 2: Delete dc_day_book_details FIRST (foreign key constraint)
  await db.dcDayBookDetails.destroy({
    where: {
      day_book_id: { [db.Sequelize.Op.in]: dayBookIds }
    },
    transaction
  });
  
  // Step 3: Delete dc_day_book records
  await db.dcDayBook.destroy({
    where: {
      id: { [db.Sequelize.Op.in]: dayBookIds }
    },
    transaction
  });
}

// Step 4: After transaction commits, recalculate (background)
setImmediate(async () => {
  const dcLedgerController = require('./dcLedgerController');
  for (const date of affectedDates) {
    await dcLedgerController.calculateAndStoreDayBook(membershipId, date);
  }
});
```

**Pros**:
- ✅ Ensures data accuracy
- ✅ Handles all edge cases
- ✅ Day book reflects current ledger entries

**Cons**:
- ⚠️ Requires recalculation method
- ⚠️ Slightly slower (background process)

---

### **Approach 2: Delete Only (Simpler)**

Just delete the day book records. They will be recalculated on-demand when viewed.

**Code**:
```javascript
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
  // Delete dc_day_book_details FIRST
  await db.dcDayBookDetails.destroy({
    where: {
      day_book_id: { [db.Sequelize.Op.in]: dayBookIds }
    },
    transaction
  });
  
  // Delete dc_day_book
  await db.dcDayBook.destroy({
    where: {
      id: { [db.Sequelize.Op.in]: dayBookIds }
    },
    transaction
  });
}

// No recalculation - will be done on-demand when user views day book
```

**Pros**:
- ✅ Simple implementation
- ✅ Fast (no recalculation)
- ✅ Works if your system has on-demand calculation

**Cons**:
- ⚠️ Day book data missing until viewed
- ⚠️ Requires on-demand calculation to be working

---

## 🔧 Complete Implementation Example

```javascript
deleteLoan = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { membershipId } = req.body;
    
    // 1. Find loan
    const loan = await db.dcLoan.findOne({
      where: { id, parent_membership_id: membershipId },
      transaction
    });
    
    if (!loan) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    // 2. Get ledger entries (to extract affected dates)
    const ledgerEntries = await db.dcLedgerEntry.findAll({
      where: {
        reference_id: id,
        reference_type: 'loan',  // ⚠️ Verify actual value
        parent_membership_id: membershipId
      },
      attributes: ['payment_date'],
      transaction
    });
    
    // 3. Extract unique payment dates
    const affectedDates = [...new Set(
      ledgerEntries.map(entry => entry.payment_date?.toISOString().split('T')[0])
    )].filter(Boolean);
    
    // 4. Delete ledger entries
    await db.dcLedgerEntry.destroy({
      where: {
        reference_id: id,
        reference_type: 'loan',
        parent_membership_id: membershipId
      },
      transaction
    });
    
    // 5. Delete day book records (if dates affected)
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
        // Delete dc_day_book_details FIRST (foreign key)
        await db.dcDayBookDetails.destroy({
          where: {
            day_book_id: { [db.Sequelize.Op.in]: dayBookIds }
          },
          transaction
        });
        
        // Delete dc_day_book
        await db.dcDayBook.destroy({
          where: {
            id: { [db.Sequelize.Op.in]: dayBookIds }
          },
          transaction
        });
      }
    }
    
    // 6. Delete loan
    await loan.destroy({ transaction });
    
    // 7. Commit transaction
    await transaction.commit();
    
    // 8. Recalculate day book (background - after commit)
    if (affectedDates.length > 0) {
      setImmediate(async () => {
        try {
          const dcLedgerController = require('./dcLedgerController');
          for (const date of affectedDates) {
            await dcLedgerController.calculateAndStoreDayBook(membershipId, date);
          }
        } catch (error) {
          console.error('Error recalculating day book:', error);
        }
      });
    }
    
    return res.json({ 
      success: true, 
      message: 'Loan deleted successfully',
      affectedDates: affectedDates.length
    });
    
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};
```

---

## ⚠️ Critical Points

1. **Delete Order**: Always delete `dc_day_book_details` BEFORE `dc_day_book` (foreign key constraint)
2. **Transaction**: Include day book deletion in the same transaction as ledger entry deletion
3. **Recalculation**: Run recalculation AFTER transaction commits (background)
4. **Affected Dates**: Only process dates that actually have day book records

---

## ✅ Testing Checklist

- [ ] Delete loan with disbursement entry only
  - Verify: `dc_day_book` deleted for disbursement date
  - Verify: `dc_day_book_details` deleted for disbursement date
  
- [ ] Delete loan with payments
  - Verify: Both tables deleted for all payment dates
  - Verify: Day book recalculated correctly
  
- [ ] Delete loan with no day book records (edge case)
  - Verify: No errors, handles gracefully
  
- [ ] Verify day book shows correct data after deletion
  - Check: Opening/closing balances
  - Check: Category breakdown excludes deleted loan entries

---

## 🔍 SQL Queries for Verification

### Check day book records before deletion:
```sql
SELECT db.id, db.date, db.opening_balance, db.closing_balance,
       COUNT(dbd.id) as detail_count
FROM dc_day_book db
LEFT JOIN dc_day_book_details dbd ON db.id = dbd.day_book_id
WHERE db.date IN ('2024-01-15', '2024-01-16')
  AND db.parent_membership_id = 1
GROUP BY db.id, db.date, db.opening_balance, db.closing_balance;
```

### Check day book details:
```sql
SELECT * FROM dc_day_book_details
WHERE day_book_id IN (
  SELECT id FROM dc_day_book 
  WHERE date IN ('2024-01-15', '2024-01-16')
  AND parent_membership_id = 1
);
```

---

**Recommendation**: Use **Approach 1** (Delete + Recalculate) for immediate data accuracy.



