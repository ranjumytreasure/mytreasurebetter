# Receipt Day Book Deletion - Explanation

## 🔍 The Problem

When you delete a loan:
- ✅ `dc_receivable` records are deleted
- ✅ `dc_receipt` records are deleted
- ❌ **But ledger entries created by receipts might not be deleted**
- ❌ **Day book details might still show receipt transactions**

## 📊 Data Flow When Receipt is Created

```
1. User pays a receivable
   ↓
2. System creates dc_receipt record
   - id: receipt-123
   - receivable_id: receivable-456
   - payment_date: 2025-11-13
   ↓
3. System creates dc_ledger_entry record
   - reference_id: receipt-123  ← Receipt ID, NOT loan ID!
   - reference_type: 'receipt'
   - payment_date: 2025-11-13
   - category: 'Collection'
   ↓
4. Day book is calculated
   - Uses ledger entries with payment_date = 2025-11-13
   - Creates dc_day_book_details with receipt transaction
```

## ❌ Current Issue

When deleting a loan, we're only looking for:
```javascript
reference_id: loanId
reference_type: ['loan_disbursement', 'loan', 'receipt']
```

**Problem**: Receipts have their own IDs! The ledger entry has:
- `reference_id = receipt.id` (NOT loan.id)
- `reference_type = 'receipt'`

So we're missing receipt-related ledger entries!

## ✅ Solution

We need to:
1. Find all receipts related to the loan (via receivables)
2. Get receipt IDs
3. Find ledger entries where `reference_id IN (receiptIds)` AND `reference_type = 'receipt'`
4. Delete those ledger entries
5. Delete day book records for affected dates
6. Cascade forward

---

## 🔧 Implementation Flow

### Step 1: Find All Receipts Related to Loan
```javascript
// Get all receivables for the loan
const receivables = loan.receivables || [];

// Get all receipt IDs
const receiptIds = [];
for (const receivable of receivables) {
    if (receivable.receipts && receivable.receipts.length > 0) {
        receiptIds.push(...receivable.receipts.map(r => r.id));
    }
}
```

### Step 2: Find Ledger Entries for Receipts
```javascript
// Find ledger entries created by receipts
const receiptLedgerEntries = await db.dcLedgerEntry.findAll({
    where: {
        reference_id: { [Op.in]: receiptIds },
        reference_type: 'receipt',
        parent_membership_id: membershipId
    },
    attributes: ['id', 'payment_date']
});
```

### Step 3: Combine All Affected Dates
```javascript
// Get dates from loan disbursement entries
const loanLedgerEntries = await db.dcLedgerEntry.findAll({
    where: {
        reference_id: loanId,
        reference_type: { [Op.in]: ['loan_disbursement', 'loan'] },
        parent_membership_id: membershipId
    },
    attributes: ['id', 'payment_date']
});

// Combine all dates
const allAffectedDates = [
    ...loanLedgerEntries.map(e => e.payment_date),
    ...receiptLedgerEntries.map(e => e.payment_date)
];
```

### Step 4: Delete Everything
```javascript
// Delete day book records
// Delete receipt ledger entries
// Delete loan ledger entries
// Delete receipts
// Delete receivables
// Delete loan
```

### Step 5: Cascade Forward
```javascript
// Recalculate from earliest date
await recalculateDayBookForward(membershipId, earliestDate);
```

---

## 📋 Complete Implementation

See updated `deleteLoan` function that:
1. ✅ Finds receipts via receivables
2. ✅ Finds ledger entries for receipts
3. ✅ Finds ledger entries for loan disbursement
4. ✅ Combines all affected dates
5. ✅ Deletes all related records
6. ✅ Cascades forward



