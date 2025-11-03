# 📖 Day Book Tables - Data Flow Explanation

## 🔄 How Tables Are Populated

### **Table 1: `dc_day_book` (Summary Table)**
This table stores the daily summary with one row per day per membership.

### **Table 2: `dc_day_book_details` (Category Breakdown Table)**
This table stores category-wise breakdown with multiple rows per day (one for each category/subcategory combination).

---

## 🚀 Data Population Methods

### **Method 1: Automatic Update When Ledger Entry is Created** ⚡

**This is the PRIMARY method** - happens automatically whenever a user creates a ledger entry.

#### Flow:

```
1. User creates a ledger entry
   ↓
2. Entry saved to dc_ledger_entries table
   ↓
3. Backend triggers updateDayBookOnEntry() in background
   ↓
4. System calculates day book for that entry's date
   ↓
5. Updates/creates dc_day_book record
   ↓
6. Updates/creates dc_day_book_details records
   ↓
7. Updates next day's opening balance
```

#### Code Location:
**File:** `src/controllers/dcLedgerController.js`

```javascript
// When ledger entry is created (line ~240)
createLedgerEntry = async (req, res) => {
    // ... save entry to dc_ledger_entries ...
    
    await transaction.commit();
    
    // ⚡ AUTOMATIC UPDATE - Runs in background (doesn't block response)
    setTimeout(async () => {
        await this.updateDayBookOnEntry(membershipId, entryDate);
    }, 100);
    
    return responseUtils.success("Ledger entry created successfully", entry, res);
};

// This function is triggered automatically (line ~634)
updateDayBookOnEntry = async (membershipId, entryDate) => {
    const date = entryDate.split('T')[0];
    
    // 1. Recalculate day book for this date
    await this.calculateAndStoreDayBook(membershipId, date);
    
    // 2. Update next day's opening balance
    // (next day's opening = today's closing)
    // ... code updates next day's opening_balance ...
};
```

---

### **Method 2: On-Demand Calculation (When Viewing Day Book)** 📅

**This is a FALLBACK method** - runs when user requests Day Book for a date that doesn't exist yet.

#### Flow:

```
1. User opens Day Book tab for a date
   ↓
2. Frontend calls GET /dc/ledger/day-book?date=2024-01-15
   ↓
3. Backend checks if dc_day_book exists for that date
   ↓
4. If NOT found:
   - Calculate from dc_ledger_entries
   - Store in dc_day_book
   - Store in dc_day_book_details
   ↓
5. Return data to frontend
```

#### Code Location:
**File:** `src/controllers/dcLedgerController.js` (line ~397)

```javascript
getDayBook = async (req, res) => {
    const { date } = req.query;
    const membershipId = req.userDetails.membershipId;
    
    // Try to fetch from stored table
    let dayBook = await db.dcDayBook.findOne({
        where: { date, parent_membership_id: membershipId },
        include: [{ model: db.dcDayBookDetails, as: 'details' }]
    });
    
    // 🔄 IF NOT FOUND - Calculate on-the-fly and store
    if (!dayBook) {
        dayBook = await this.calculateAndStoreDayBook(membershipId, date);
    }
    
    // Format and return response
    // ...
};
```

---

## 🔧 How `calculateAndStoreDayBook()` Works

This is the **core function** that populates both tables.

### Step-by-Step Process:

```javascript
calculateAndStoreDayBook = async (membershipId, date) => {
    // STEP 1: Get opening balance (previous day's closing)
    const openingBalance = await this.calculatePreviousDayClosing(membershipId, date);
    
    // STEP 2: Get all ledger entries for THIS SPECIFIC DATE ONLY
    const entries = await db.dcLedgerEntry.findAll({
        where: {
            parent_membership_id: membershipId,
            created_at: {
                [Op.gte]: new Date(date + 'T00:00:00.000Z'),
                [Op.lt]: new Date(new Date(date + 'T00:00:00.000Z').getTime() + 24 * 60 * 60 * 1000)
            },
            deleted_at: null
        }
    });
    
    // STEP 3: Calculate totals and group by category
    let totalReceived = 0;
    let totalSpent = 0;
    const categoryMap = {};
    
    entries.forEach(entry => {
        const amount = parseFloat(entry.amount || 0);
        const isCollection = entry.category === 'Collection' || entry.category === 'Income';
        
        if (isCollection) {
            totalReceived += amount;
        } else {
            totalSpent += amount;
        }
        
        // Group by category + subcategory
        const key = `${transactionType}_${entry.category}_${entry.subcategory || ''}`;
        if (!categoryMap[key]) {
            categoryMap[key] = {
                transaction_type: isCollection ? 'COLLECTION' : 'EXPENSE',
                category: entry.category,
                subcategory: entry.subcategory || null,
                amount: 0,
                count: 0
            };
        }
        categoryMap[key].amount += amount;
        categoryMap[key].count += 1;
    });
    
    // STEP 4: Calculate closing balance
    const closingBalance = openingBalance + totalReceived - totalSpent;
    
    // STEP 5: Create or update dc_day_book record
    const [dayBook] = await db.dcDayBook.findOrCreate({
        where: { date, parent_membership_id: membershipId },
        defaults: {
            id: uuidv4(),
            date,
            parent_membership_id: membershipId,
            opening_balance: openingBalance,
            closing_balance: closingBalance,
            total_received: totalReceived,
            total_spent: totalSpent
        }
    });
    
    // If already exists, update it
    if (!dayBook.isNewRecord) {
        await dayBook.update({
            opening_balance: openingBalance,
            closing_balance: closingBalance,
            total_received: totalReceived,
            total_spent: totalSpent
        });
    }
    
    // STEP 6: Delete old details and create new ones
    await db.dcDayBookDetails.destroy({
        where: { day_book_id: dayBook.id }
    });
    
    // STEP 7: Create dc_day_book_details records (one per category/subcategory)
    const detailsArray = Object.values(categoryMap).map(cat => ({
        id: uuidv4(),
        day_book_id: dayBook.id,
        transaction_type: cat.transaction_type,
        category: cat.category,
        subcategory: cat.subcategory || null,
        amount: cat.amount,
        transaction_count: cat.count
    }));
    
    if (detailsArray.length > 0) {
        await db.dcDayBookDetails.bulkCreate(detailsArray);
    }
    
    return dayBook;
};
```

---

## 📊 Example: How Data Gets Into Tables

### Scenario: User creates 3 ledger entries on January 15, 2024

#### Entry 1:
```
Category: Collection
Subcategory: Loan Payments
Amount: ₹5,000
Date: 2024-01-15
```

#### Entry 2:
```
Category: Income
Subcategory: Interest
Amount: ₹1,500
Date: 2024-01-15
```

#### Entry 3:
```
Category: Expense
Subcategory: Office Supplies
Amount: ₹2,000
Date: 2024-01-15
```

---

### What Happens Automatically:

#### 1️⃣ When Entry 1 is created:
```sql
-- dc_day_book (created if doesn't exist)
INSERT INTO dc_day_book VALUES (
    id: 'uuid-123',
    date: '2024-01-15',
    opening_balance: 50000.00,  -- from previous day
    total_received: 5000.00,
    total_spent: 0.00,
    closing_balance: 55000.00,
    parent_membership_id: 1
);

-- dc_day_book_details
INSERT INTO dc_day_book_details VALUES (
    id: 'uuid-detail-1',
    day_book_id: 'uuid-123',
    transaction_type: 'COLLECTION',
    category: 'Collection',
    subcategory: 'Loan Payments',
    amount: 5000.00,
    transaction_count: 1
);
```

#### 2️⃣ When Entry 2 is created:
```sql
-- dc_day_book (updated)
UPDATE dc_day_book SET
    total_received = 6500.00,  -- 5000 + 1500
    closing_balance = 56500.00  -- opening + received - spent
WHERE date = '2024-01-15';

-- dc_day_book_details (new row added)
INSERT INTO dc_day_book_details VALUES (
    id: 'uuid-detail-2',
    day_book_id: 'uuid-123',
    transaction_type: 'COLLECTION',
    category: 'Income',
    subcategory: 'Interest',
    amount: 1500.00,
    transaction_count: 1
);
```

#### 3️⃣ When Entry 3 is created:
```sql
-- dc_day_book (updated)
UPDATE dc_day_book SET
    total_spent = 2000.00,
    closing_balance = 54500.00  -- opening + received - spent
WHERE date = '2024-01-15';

-- dc_day_book_details (new row added)
INSERT INTO dc_day_book_details VALUES (
    id: 'uuid-detail-3',
    day_book_id: 'uuid-123',
    transaction_type: 'EXPENSE',
    category: 'Expense',
    subcategory: 'Office Supplies',
    amount: 2000.00,
    transaction_count: 1
);
```

#### 4️⃣ Final State After All 3 Entries:

**dc_day_book (1 row):**
```
date: 2024-01-15
opening_balance: 50000.00
total_received: 6500.00
total_spent: 2000.00
closing_balance: 54500.00
```

**dc_day_book_details (3 rows):**
```
Row 1: COLLECTION | Collection | Loan Payments | 5000.00 | 1 transaction
Row 2: COLLECTION | Income | Interest | 1500.00 | 1 transaction
Row 3: EXPENSE | Expense | Office Supplies | 2000.00 | 1 transaction
```

---

## 🔄 When Day Book Gets Recalculated

The Day Book is recalculated and updated in these scenarios:

### ✅ **Automatic Recalculation:**

1. **Every time a ledger entry is created**
   - Runs in background (doesn't block user)
   - Updates the day book for that entry's date
   - Updates next day's opening balance

2. **When viewing Day Book for a date that doesn't exist**
   - Calculates on-the-fly from `dc_ledger_entries`
   - Stores result for future fast retrieval

### ⚠️ **Note on Recalculation:**

The system uses a **"Recalculate Everything"** approach:
- When updating, it deletes all old `dc_day_book_details` records
- Recalculates from scratch from `dc_ledger_entries`
- Creates fresh detail records

This ensures:
- ✅ Data is always accurate
- ✅ No duplicate or orphaned records
- ✅ Category breakdown matches actual entries

---

## 📝 Summary

### **How Tables Get Data:**

1. **Automatically** when ledger entries are created (primary method)
2. **On-demand** when viewing Day Book for a date without data (fallback)

### **What Gets Stored:**

- **`dc_day_book`**: Daily summary (opening, closing, totals)
- **`dc_day_book_details`**: Category-wise breakdown

### **Data Source:**

All data comes from `dc_ledger_entries` table - the Day Book is a calculated/cached view of ledger entries grouped by date and category.

---

## 🎯 Key Points

✅ **Tables are auto-populated** - No manual intervention needed  
✅ **Updates happen in background** - Doesn't slow down entry creation  
✅ **Data is always fresh** - Recalculated when entries change  
✅ **Fast retrieval** - Stored data loads instantly  
✅ **Fallback calculation** - Works even if data is missing  


