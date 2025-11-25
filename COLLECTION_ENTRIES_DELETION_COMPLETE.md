# Collection Entries Deletion - Complete Solution

## ✅ Issue Fixed

**Problem**: Collection entries were remaining in `dc_ledger_entries` after deleting a loan.

**Root Cause**: Collections are created with `reference_type = 'payment_collection'` (not 'receipt'), and we were only looking for 'receipt' type.

---

## 🔍 All Collection Entry Types We Now Delete

### **Type 1: Receipt Collections** (via Receipt IDs)
```javascript
// Created when payment is collected via /dc/collections/pay
{
    reference_id: receipt.id,           // Receipt ID
    reference_type: 'payment_collection', // ← This was missing!
    category: 'Collection',
    subcategory: 'Full Payment' or 'Partial Payment'
}
```

**How we find them**:
```javascript
reference_id IN receiptIds
reference_type IN ['receipt', 'payment_collection']
```

---

### **Type 2: Direct Loan Collections** (Safety Check)
```javascript
// Legacy entries or entries created directly with loan ID
{
    reference_id: loanId,     // Loan ID directly
    category: 'Collection',   // Category = Collection
    reference_type: (any)     // Any reference type
}
```

**How we find them**:
```javascript
reference_id = loanId
category = 'Collection'
```

**Why**: Safety check for any legacy entries or edge cases where collections might be directly linked to loan.

---

## 📋 Complete Deletion Strategy

### **Step 1: Find All Receipt IDs**
```javascript
const receiptIds = [];
for (const receivable of loan.receivables || []) {
    if (receivable.receipts && receivable.receipts.length > 0) {
        receiptIds.push(...receivable.receipts.map(r => r.id));
    }
}
```

### **Step 2: Find All Ledger Entries**

**a) Loan Disbursement Entries:**
```javascript
reference_id = loanId
reference_type IN ['loan_disbursement', 'loan']
```

**b) Direct Loan Collections (Safety):**
```javascript
reference_id = loanId
category = 'Collection'
```

**c) Receipt Collections:**
```javascript
reference_id IN receiptIds
reference_type IN ['receipt', 'payment_collection']
```

### **Step 3: Delete All Found Entries**

We delete:
1. ✅ Loan disbursement entries
2. ✅ Direct loan collection entries (safety check)
3. ✅ Receipt collection entries (via receipt IDs)

---

## 🎯 What Gets Deleted Now

| Entry Type | Category | reference_id | reference_type | How Found | Deleted? |
|------------|----------|--------------|----------------|-----------|----------|
| Loan Disbursement | Loan Disbursement | `loanId` | `loan_disbursement` | Direct | ✅ Yes |
| Loan Disbursement | Loan Disbursement | `loanId` | `loan` | Direct | ✅ Yes |
| **Collection (Direct)** | **Collection** | **`loanId`** | **(any)** | **Safety check** | ✅ **Yes (NEW!)** |
| **Collection (Receipt)** | **Collection** | **`receipt.id`** | **`payment_collection`** | **Via receipt** | ✅ **Yes (FIXED!)** |
| Receipt Entry | Collection | `receipt.id` | `receipt` | Via receipt | ✅ Yes |

---

## 🔄 Complete Flow

```
Delete Loan
  ↓
1. Find receipts via receivables
   → receiptIds = [receipt-123, receipt-456]
  ↓
2. Find ledger entries:
   a) Loan disbursement: reference_id = loanId, type IN ['loan_disbursement', 'loan']
   b) Direct collections: reference_id = loanId, category = 'Collection' ← NEW!
   c) Receipt collections: reference_id IN receiptIds, type IN ['receipt', 'payment_collection'] ← FIXED!
  ↓
3. Extract all affected dates
  ↓
4. Delete day book records
  ↓
5. Delete all ledger entries (all 3 types)
  ↓
6. Delete receipts, receivables, loan
  ↓
7. Cascade forward
```

---

## ✅ Result

**Before Fix**:
- ❌ Collection entries with `reference_type = 'payment_collection'` NOT deleted
- ❌ Collection entries directly linked to loan (if any) NOT deleted

**After Fix**:
- ✅ All collection entries deleted (via receipts)
- ✅ All collection entries deleted (direct link - safety check)
- ✅ All loan disbursement entries deleted
- ✅ All day book records deleted
- ✅ All data cleaned up properly

---

## 🛡️ Safety Measures

1. **Primary Method**: Find collections via receipt IDs (most common)
2. **Safety Check**: Also find collections directly linked to loan ID (catches edge cases)
3. **Comprehensive**: Covers all possible ways collections could be linked to loan

---

## 📊 Example

### **Before Deletion:**
```
dc_ledger_entries:
- Entry 1: reference_id = loan-123, type = 'loan_disbursement' ✅ Will delete
- Entry 2: reference_id = loan-123, category = 'Collection' ✅ Will delete (safety)
- Entry 3: reference_id = receipt-456, type = 'payment_collection' ✅ Will delete (fixed)
- Entry 4: reference_id = receipt-456, type = 'receipt' ✅ Will delete
```

### **After Deletion:**
```
dc_ledger_entries:
- All entries deleted ✅
- Day book recalculated ✅
```

---

## ✅ Summary

**We now delete ALL collection entries** related to the loan:
1. ✅ Via receipt IDs (most common - `payment_collection` type)
2. ✅ Directly linked to loan (safety check for legacy entries)
3. ✅ All reference types covered

**No collection entries will remain in `dc_ledger_entries` after loan deletion!**



