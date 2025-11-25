# Collection Entries Deletion - Fix Explanation

## 🔍 The Issue

When deleting a loan, **collection entries were NOT being deleted** because:

1. **Collection entries** are created with `reference_type = 'payment_collection'` (from `dcCollectionsController.collectPayment()`)
2. **Delete loan function** was only looking for `reference_type = 'receipt'`
3. **Result**: Collection entries remained in `dc_ledger_entries` table

---

## 📊 How Collections Are Created

When a payment is collected via `/dc/collections/pay`:

```javascript
// In dcCollectionsController.collectPayment()
const ledgerEntry = await db.dcLedgerEntry.create({
    category: 'Collection',
    subcategory: 'Full Payment' or 'Partial Payment',
    amount: paidAmount,
    reference_id: receipt.id,           // Receipt ID
    reference_type: 'payment_collection',  // ← This is the key!
    payment_date: paymentDate
});
```

**Key Point**: `reference_type = 'payment_collection'` (NOT 'receipt')

---

## ❌ Previous Implementation (Incomplete)

```javascript
// Only looking for 'receipt' type
receiptLedgerEntries = await db.dcLedgerEntry.findAll({
    where: {
        reference_id: { [Op.in]: receiptIds },
        reference_type: 'receipt',  // ❌ Missing 'payment_collection'!
        parent_membership_id: membershipId
    }
});
```

**Problem**: Collection entries with `reference_type = 'payment_collection'` were NOT found and NOT deleted!

---

## ✅ Fixed Implementation

```javascript
// Now looking for BOTH 'receipt' AND 'payment_collection' types
receiptLedgerEntries = await db.dcLedgerEntry.findAll({
    where: {
        reference_id: { [Op.in]: receiptIds },
        reference_type: {
            [db.Sequelize.Op.in]: ['receipt', 'payment_collection']  // ✅ Both types!
        },
        parent_membership_id: membershipId
    }
});
```

**Also updated deletion**:
```javascript
// Delete both types
await db.dcLedgerEntry.destroy({
    where: {
        reference_id: { [Op.in]: receiptIds },
        reference_type: {
            [db.Sequelize.Op.in]: ['receipt', 'payment_collection']  // ✅ Both types!
        },
        parent_membership_id: membershipId
    }
});
```

---

## 📋 What Gets Deleted Now

| Entry Type | Category | reference_type | reference_id | Deleted? |
|------------|----------|----------------|--------------|----------|
| Loan Disbursement | Loan Disbursement | `loan_disbursement` | `loanId` | ✅ Yes |
| Loan Disbursement | Loan Disbursement | `loan` | `loanId` | ✅ Yes |
| Collection (Payment) | Collection | `payment_collection` | `receipt.id` | ✅ Yes (FIXED!) |
| Receipt Entry | Collection | `receipt` | `receipt.id` | ✅ Yes |

---

## 🔄 Complete Flow

### When Payment is Collected:
```
1. User pays receivable
   ↓
2. System creates dc_receipt (id = receipt-123)
   ↓
3. System creates dc_ledger_entry:
   - category: 'Collection'
   - reference_id: receipt-123
   - reference_type: 'payment_collection'  ← Key!
   ↓
4. Day book includes this collection
```

### When Loan is Deleted:
```
1. Find all receipts for loan
   ↓
2. Get receipt IDs: [receipt-123, receipt-456]
   ↓
3. Find ledger entries:
   - reference_id IN [receipt-123, receipt-456]
   - reference_type IN ['receipt', 'payment_collection']  ← FIXED!
   ↓
4. Delete all found entries (including collections!)
   ↓
5. Delete day book records
   ↓
6. Cascade forward
```

---

## ✅ Result

- ✅ **Loan disbursement entries** deleted
- ✅ **Collection entries** deleted (FIXED!)
- ✅ **Receipt entries** deleted
- ✅ **Day book records** deleted
- ✅ **Day book details** deleted
- ✅ **All data cleaned up** properly

---

## 🎯 Summary

**Before Fix**: Collection entries with `reference_type = 'payment_collection'` were NOT deleted

**After Fix**: Collection entries with `reference_type = 'payment_collection'` are now deleted along with receipt entries

**Implementation**: Updated delete loan function to look for both `'receipt'` and `'payment_collection'` reference types.



