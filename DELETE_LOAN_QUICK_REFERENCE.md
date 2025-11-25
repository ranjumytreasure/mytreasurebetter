# Delete Loan - Quick Implementation Reference

## 🎯 Goal
When deleting a loan, also delete:
1. Related ledger entries
2. Delete affected day book records (`dc_day_book` and `dc_day_book_details`)
3. Recalculate day book for affected dates

---

## 📍 Backend File Location
```
treasure-service-main/src/controllers/dc/dcLoanController.js
```

---

## 🔧 Implementation Steps

### 1. Find Ledger Entries Before Deletion
```javascript
const ledgerEntries = await db.dcLedgerEntry.findAll({
  where: {
    reference_id: id,
    reference_type: 'loan',  // ⚠️ Verify actual value!
    parent_membership_id: membershipId
  },
  attributes: ['payment_date']
});
```

### 2. Extract Affected Dates
```javascript
const affectedDates = [...new Set(
  ledgerEntries.map(entry => entry.payment_date?.toISOString().split('T')[0])
)].filter(Boolean);
```

### 3. Delete Ledger Entries
```javascript
await db.dcLedgerEntry.destroy({
  where: {
    reference_id: id,
    reference_type: 'loan',
    parent_membership_id: membershipId
  },
  transaction
});
```

### 4. Delete Day Book Records (Within Transaction)
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
  // Delete dc_day_book_details FIRST (foreign key constraint)
  await db.dcDayBookDetails.destroy({
    where: {
      day_book_id: { [db.Sequelize.Op.in]: dayBookIds }
    },
    transaction
  });
  
  // Delete dc_day_book records
  await db.dcDayBook.destroy({
    where: {
      id: { [db.Sequelize.Op.in]: dayBookIds }
    },
    transaction
  });
}
```

### 5. Recalculate Day Book (Background - After Commit)
```javascript
// After transaction commits
setImmediate(async () => {
  const dcLedgerController = require('./dcLedgerController');
  for (const date of affectedDates) {
    await dcLedgerController.calculateAndStoreDayBook(membershipId, date);
  }
});
```

---

## ⚠️ Critical Checks

1. **Verify `reference_type` value**: Check what's used in loan disbursement code
2. **Use transactions**: Wrap all deletions in a transaction
3. **Background recalculation**: Use `setImmediate` to avoid blocking response

---

## 📋 Complete Code Structure

```javascript
deleteLoan = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    // 1. Find loan
    // 2. Get ledger entries (to extract dates)
    // 3. Delete ledger entries
    // 4. Delete loan
    // 5. Commit transaction
    // 6. Recalculate day book (background)
  } catch (error) {
    await transaction.rollback();
    // Handle error
  }
};
```

---

## 🔍 How to Find Reference Type Value

Look in `dcLoanController.js` → `disburse` method:
```javascript
await db.dcLedgerEntry.create({
  reference_type: 'loan',  // ← This value
  reference_id: loan.id,
  // ...
});
```

---

## ✅ Testing Checklist

- [ ] Delete loan with no payments
- [ ] Delete loan with payments
- [ ] Verify ledger entries deleted
- [ ] Verify day book recalculated
- [ ] Check day book balances are correct

---

**See full plan**: `DELETE_LOAN_IMPLEMENTATION_PLAN.md`

