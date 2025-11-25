# How dc_day_book & dc_day_book_details Are Deleted

## 📋 Overview

When deleting a loan, both day book tables are deleted in a specific order due to foreign key constraints.

---

## 🔗 Table Relationship

```
dc_day_book (Parent Table)
  ├── id (Primary Key)
  ├── date
  ├── opening_balance
  ├── closing_balance
  └── ...
  
dc_day_book_details (Child Table)
  ├── id (Primary Key)
  ├── day_book_id (Foreign Key → dc_day_book.id) ← MUST DELETE FIRST
  ├── transaction_type
  ├── category
  └── ...
```

**Foreign Key Constraint**: `dc_day_book_details.day_book_id` references `dc_day_book.id`

**Rule**: You **MUST** delete child records (`dc_day_book_details`) **BEFORE** parent records (`dc_day_book`)

---

## 🔧 Step-by-Step Deletion Process

### **Step 1: Find Affected Dates**

First, we identify which dates have day book records that need to be deleted:

```javascript
// Get all payment dates from ledger entries (loan + receipts)
const affectedDates = ['2025-11-13', '2025-11-14', '2025-11-15'];
```

### **Step 2: Find Day Book Records for Those Dates**

```javascript
// Find all dc_day_book records for affected dates
const dayBooks = await db.dcDayBook.findAll({
    where: {
        date: { [db.Sequelize.Op.in]: affectedDates },  // ['2025-11-13', '2025-11-14', '2025-11-15']
        parent_membership_id: membershipId
    },
    attributes: ['id'],  // Only get IDs
    transaction
});

// Extract day book IDs
const dayBookIds = dayBooks.map(dayBook => dayBook.id);
// Example: dayBookIds = ['daybook-1', 'daybook-2', 'daybook-3']
```

**Result**: We get IDs of all day book records that need to be deleted.

---

### **Step 3: Delete dc_day_book_details FIRST** ⚠️

**Why First?** Because it has a foreign key to `dc_day_book`. If we delete `dc_day_book` first, the database will throw a foreign key constraint error.

```javascript
// Delete ALL details records that belong to these day books
await db.dcDayBookDetails.destroy({
    where: {
        day_book_id: { 
            [db.Sequelize.Op.in]: dayBookIds  // ['daybook-1', 'daybook-2', 'daybook-3']
        }
    },
    transaction
});
```

**What This Does**:
- Finds all `dc_day_book_details` records where `day_book_id` matches any of our day book IDs
- Deletes them all in one query
- Example: If daybook-1 has 5 detail records, daybook-2 has 3, daybook-3 has 2 → **10 detail records deleted**

**SQL Equivalent**:
```sql
DELETE FROM dc_day_book_details 
WHERE day_book_id IN ('daybook-1', 'daybook-2', 'daybook-3');
```

---

### **Step 4: Delete dc_day_book Records**

Now that all child records are deleted, we can safely delete the parent records:

```javascript
// Delete the day book records themselves
await db.dcDayBook.destroy({
    where: {
        id: { 
            [db.Sequelize.Op.in]: dayBookIds  // ['daybook-1', 'daybook-2', 'daybook-3']
        }
    },
    transaction
});
```

**What This Does**:
- Deletes the actual day book records
- Example: **3 day book records deleted** (one for each date)

**SQL Equivalent**:
```sql
DELETE FROM dc_day_book 
WHERE id IN ('daybook-1', 'daybook-2', 'daybook-3');
```

---

## 📊 Visual Example

### **Before Deletion:**

```
dc_day_book:
┌─────────────┬──────────────┬──────────────────┐
│ id          │ date         │ closing_balance │
├─────────────┼──────────────┼──────────────────┤
│ daybook-1   │ 2025-11-13   │ ₹45,000         │
│ daybook-2   │ 2025-11-14   │ ₹46,000         │
│ daybook-3   │ 2025-11-15   │ ₹49,000         │
└─────────────┴──────────────┴──────────────────┘

dc_day_book_details:
┌──────┬──────────────┬──────────────┬─────────────┐
│ id   │ day_book_id │ category     │ amount      │
├──────┼──────────────┼──────────────┼─────────────┤
│ d1   │ daybook-1   │ Collection   │ ₹5,000      │
│ d2   │ daybook-1   │ Expense      │ ₹10,000     │
│ d3   │ daybook-1   │ Collection   │ ₹3,000      │
│ d4   │ daybook-2   │ Collection   │ ₹2,000      │
│ d5   │ daybook-2   │ Expense      │ ₹1,000      │
│ d6   │ daybook-3   │ Collection   │ ₹4,000      │
└──────┴──────────────┴──────────────┴─────────────┘
```

### **After Step 3 (Delete Details):**

```
dc_day_book:
┌─────────────┬──────────────┬──────────────────┐
│ id          │ date         │ closing_balance │
├─────────────┼──────────────┼──────────────────┤
│ daybook-1   │ 2025-11-13   │ ₹45,000         │ ← Still exists
│ daybook-2   │ 2025-11-14   │ ₹46,000         │ ← Still exists
│ daybook-3   │ 2025-11-15   │ ₹49,000         │ ← Still exists
└─────────────┴──────────────┴──────────────────┘

dc_day_book_details:
┌──────┬──────────────┬──────────────┬─────────────┐
│ id   │ day_book_id │ category     │ amount      │
├──────┼──────────────┼──────────────┼─────────────┤
│      │             │              │             │ ← ALL DELETED
└──────┴──────────────┴──────────────┴─────────────┘
```

### **After Step 4 (Delete Day Books):**

```
dc_day_book:
┌─────────────┬──────────────┬──────────────────┐
│ id          │ date         │ closing_balance │
├─────────────┼──────────────┼──────────────────┤
│             │              │                  │ ← ALL DELETED
└─────────────┴──────────────┴──────────────────┘

dc_day_book_details:
┌──────┬──────────────┬──────────────┬─────────────┐
│ id   │ day_book_id │ category     │ amount      │
├──────┼──────────────┼──────────────┼─────────────┤
│      │             │              │             │ ← ALL DELETED
└──────┴──────────────┴──────────────┴─────────────┘
```

---

## 🔄 Complete Code Flow

```javascript
// Step 1: Get affected dates from ledger entries
const affectedDates = ['2025-11-13', '2025-11-14', '2025-11-15'];

// Step 2: Find day book records for those dates
const dayBooks = await db.dcDayBook.findAll({
    where: {
        date: { [db.Sequelize.Op.in]: affectedDates },
        parent_membership_id: membershipId
    },
    attributes: ['id'],
    transaction
});

const dayBookIds = dayBooks.map(dayBook => dayBook.id);
// dayBookIds = ['daybook-1', 'daybook-2', 'daybook-3']

if (dayBookIds.length > 0) {
    // Step 3: Delete dc_day_book_details FIRST (foreign key constraint)
    await db.dcDayBookDetails.destroy({
        where: {
            day_book_id: { [db.Sequelize.Op.in]: dayBookIds }
        },
        transaction
    });
    // ✅ Deletes all detail records (e.g., 6 records)
    
    // Step 4: Delete dc_day_book records
    await db.dcDayBook.destroy({
        where: {
            id: { [db.Sequelize.Op.in]: dayBookIds }
        },
        transaction
    });
    // ✅ Deletes all day book records (e.g., 3 records)
}
```

---

## ⚠️ Why This Order Matters

### **Wrong Order (Will Fail):**
```javascript
// ❌ WRONG: Delete parent first
await db.dcDayBook.destroy({ where: { id: { [Op.in]: dayBookIds } } });

// ❌ ERROR: Foreign key constraint violation!
// Cannot delete dc_day_book because dc_day_book_details still references it
await db.dcDayBookDetails.destroy({ where: { day_book_id: { [Op.in]: dayBookIds } } });
```

### **Correct Order (Works):**
```javascript
// ✅ CORRECT: Delete child first
await db.dcDayBookDetails.destroy({ where: { day_book_id: { [Op.in]: dayBookIds } } });

// ✅ SUCCESS: Now we can delete parent
await db.dcDayBook.destroy({ where: { id: { [Op.in]: dayBookIds } } });
```

---

## 📋 Summary

1. **Find affected dates** from ledger entries
2. **Find day book IDs** for those dates
3. **Delete `dc_day_book_details` FIRST** (child table with foreign key)
4. **Delete `dc_day_book` SECOND** (parent table)
5. **Cascade forward** to recalculate from remaining ledger entries

**Key Point**: Always delete child records (`dc_day_book_details`) before parent records (`dc_day_book`) due to foreign key constraints.

---

## 🔍 What Happens After Deletion?

After deletion, the cascade forward function recalculates the day book from the remaining ledger entries:

```javascript
// After transaction commits
await recalculateDayBookForward(membershipId, earliestDate);
```

This:
1. Recalculates day book for the earliest affected date
2. Cascades forward to update all subsequent dates
3. Creates new `dc_day_book` and `dc_day_book_details` records
4. Ensures data accuracy based on remaining ledger entries

---

## ✅ Result

- ✅ All old day book records deleted
- ✅ All old day book details deleted
- ✅ New day book records created (without deleted loan/receipt data)
- ✅ Data integrity maintained
- ✅ No orphaned records



