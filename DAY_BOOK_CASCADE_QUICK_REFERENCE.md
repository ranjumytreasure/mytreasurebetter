# Day Book Cascade Forward - Quick Reference

## 🎯 Core Concept

When a transaction is added/deleted/edited on date **X**:
1. Recalculate day book for date **X**
2. **Cascade forward** all subsequent dates (X+1, X+2, ...)

**Why?** Each day's opening balance = previous day's closing balance

---

## 🔧 Implementation

### **Main Function**

```javascript
recalculateDayBookForward(membershipId, startDate)
```

**What it does**:
1. Recalculates day book for `startDate`
2. Finds all subsequent dates with day book records
3. Recalculates each subsequent date using previous day's closing balance

---

## 📋 Usage in Different Scenarios

### **Case 1: Delete Loan**

```javascript
// After deleting loan entries
const earliestDate = affectedDates.sort()[0];
await dcLedgerController.recalculateDayBookForward(membershipId, earliestDate);
```

### **Case 2: Add/Edit Ledger Entry**

```javascript
// After creating/updating entry
const effectiveDate = payment_date || new Date().toISOString().split('T')[0];
await dcLedgerController.recalculateDayBookForward(membershipId, effectiveDate);
```

---

## 🔄 Cascade Logic

```
Date X: Recalculate closing_balance
  ↓
Date X+1: opening_balance = Date X's closing_balance
         Recalculate closing_balance
  ↓
Date X+2: opening_balance = Date X+1's closing_balance
         Recalculate closing_balance
  ↓
... (continues for all subsequent dates)
```

---

## ⚠️ Key Points

1. **Use `payment_date`** (not `created_at`) for day book calculations
2. **Start from earliest date** when multiple dates are affected
3. **Process chronologically** (oldest to newest)
4. **Background processing** to avoid blocking API

---

## 📍 File Reference

**Full Implementation**: `DAY_BOOK_CASCADE_FORWARD_IMPLEMENTATION.md`



