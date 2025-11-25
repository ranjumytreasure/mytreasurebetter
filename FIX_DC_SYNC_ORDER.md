# Fix: dc_loan Sync Order Issue

## Problem
Sequelize is trying to sync `dc_loan` table before `dc_subscriber` and `dc_product` tables exist, causing error `42P01` (undefined_table).

## Root Cause
Models are being loaded/synced in the wrong order. `dc_loan` depends on `dc_subscriber` and `dc_product`, so they must be synced first.

---

## Solution 1: Quick Fix - Run SQL Script

Run the provided SQL script to create tables manually in the correct order:

```bash
# Connect to your database and run:
psql -U your_user -d your_database -f fix-dc-tables.sql
```

OR manually execute the SQL in `fix-dc-tables.sql`.

This creates all tables in the correct dependency order:
1. `dc_subscriber` ✅
2. `dc_product` ✅  
3. `dc_loan` ✅ (depends on above)
4. `dc_receivable` ✅ (depends on dc_loan)
5. `dc_receipt` ✅ (depends on dc_receivable)

---

## Solution 2: Fix Model Loading Order (Permanent)

Update your backend `models/index.js` to load models in dependency order.

### Required Order:
1. **dcSubscriber** (no DC dependencies)
2. **dcProduct** (no DC dependencies)  
3. **dcLoan** (depends on dcSubscriber, dcProduct)
4. **dcReceivable** (depends on dcLoan)
5. **dcReceipt** (depends on dcReceivable)

### Example `models/index.js` Structure:

```javascript
const sequelize = require("../config/database");
const Sequelize = require("sequelize");

// Load base models first (membership, users, etc.)
// ... existing base models ...

// Load DC models in DEPENDENCY ORDER
let dcCompany = require("./dcCompany")(sequelize, Sequelize);
let dcSubscriber = require("./dcSubscriber")(sequelize, Sequelize);  // ← First
let dcProduct = require("./dcProduct")(sequelize, Sequelize);       // ← First
let dcLoan = require("./dcLoan")(sequelize, Sequelize);              // ← Depends on above
let dcReceivable = require("./dcReceivable")(sequelize, Sequelize);  // ← Depends on dcLoan
let dcReceipt = require("./dcReceipt")(sequelize, Sequelize);        // ← Depends on dcReceivable

const db = {
  sequelize,
  Sequelize,
  // ... existing models ...
  dcCompany,
  dcSubscriber,    // ← Must be before dcLoan
  dcProduct,       // ← Must be before dcLoan
  dcLoan,          // ← After dcSubscriber and dcProduct
  dcReceivable,    // ← After dcLoan
  dcReceipt,       // ← After dcReceivable
};

// Run associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
```

### Alternative: Sync Models in Order

If you can't change the loading order, sync models explicitly:

```javascript
// In your server.js or app initialization

const db = require("./models");

async function syncModels() {
  try {
    // Sync in dependency order
    await db.dcSubscriber.sync({ alter: true });  // or { force: true } for development
    await db.dcProduct.sync({ alter: true });
    await db.dcLoan.sync({ alter: true });
    await db.dcReceivable.sync({ alter: true });
    await db.dcReceipt.sync({ alter: true });
    
    console.log("✅ All DC tables synced successfully!");
  } catch (error) {
    console.error("❌ Sync error:", error);
  }
}

// Call after sequelize.authenticate()
syncModels();
```

---

## Solution 3: Disable Foreign Key Checks Temporarily (Not Recommended)

If you must sync all at once, temporarily disable FK constraints:

```javascript
// ⚠️ Only for development/debugging
await sequelize.query('SET CONSTRAINTS ALL DEFERRED');
await sequelize.sync({ alter: true });
await sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
```

**Warning:** This can cause data integrity issues. Use Solution 1 or 2 instead.

---

## Verification

After applying the fix, verify tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'dc_%'
ORDER BY table_name;
```

Expected output:
- dc_company
- dc_loan
- dc_product
- dc_receipt
- dc_receivable
- dc_subscriber

---

## Recommended Action

**For immediate deployment:** Use Solution 1 (run SQL script)
**For long-term fix:** Use Solution 2 (fix model loading order)


