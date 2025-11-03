# Loan Agreement S3 Signed URL Implementation Guide

## Overview
This guide shows how to implement the same S3 signed URL pattern for `loan_agreement_doc` that is already used for `company_logo` in `dc_company`.

---

## ✅ Frontend Changes (Already Done)

The frontend has been updated to use `loan_agreement_doc_s3_image` if provided by the backend, following the same pattern as `company_logo_s3_image`.

**File Updated:** `src/pages/dailyCollection/LoansPage.js`
- Now checks for `loan.loan_agreement_doc_s3_image` first
- Falls back to original `loan_agreement_doc` if signed URL not available

---

## 🔧 Backend Changes Required

### Location
Backend code is in: `C:\Users\mail2\OneDrive\Desktop\Mani\Treasure Artifacts\Treasureservice\Latest from Github\treasure-service-main (1)`

### Files to Update

#### 1. **dcLoanController.js**
**Location:** `treasure-service-main/src/controllers/dcLoanController.js`

**What to do:**
1. Import `prepareS3Image` at the top (same way it's done for dc_company):
```javascript
const { prepareS3Image } = require('../utils/s3Helper'); // or wherever it's located
```

2. In **ALL methods that return loan data**, add `prepareS3Image` call:
   - `getAllLoans()` - When fetching list of loans
   - `getLoanById()` - When fetching single loan details
   - `disburseLoan()` - When returning the newly disbursed loan

**Example Implementation:**

```javascript
// In getAllLoans() method
async getAllLoans(req, res) {
    try {
        // ... existing code to fetch loans ...
        
        const loans = await DcLoan.findAll({
            // ... your query options ...
        });

        // Convert loan_agreement_doc to signed URL for each loan
        const loansWithSignedUrls = await Promise.all(
            loans.map(async (loan) => {
                const loanData = loan.toJSON();
                
                // Convert loan_agreement_doc to signed URL (same pattern as company_logo)
                if (loanData.loan_agreement_doc) {
                    const inputObj = { loan_agreement_doc: loanData.loan_agreement_doc };
                    const result = await prepareS3Image(inputObj, "loan_agreement_doc", "loan_agreement_doc");
                    
                    // Add signed URL field
                    loanData.loan_agreement_doc_s3_image = result.loan_agreement_doc_s3_image || null;
                }
                
                return loanData;
            })
        );

        return responseUtils.success(res, loansWithSignedUrls, "Loans fetched successfully");
    } catch (error) {
        // ... error handling ...
    }
}

// In getLoanById() method
async getLoanById(req, res) {
    try {
        // ... existing code to fetch loan with relations ...
        
        const loan = await DcLoan.findOne({
            where: { id: req.params.id },
            include: [
                // ... your includes (subscriber, product, receivables, etc.) ...
            ]
        });

        if (!loan) {
            return responseUtils.failure(res, "Loan not found", 404);
        }

        const loanData = loan.toJSON();
        
        // Convert loan_agreement_doc to signed URL
        if (loanData.loan_agreement_doc) {
            const inputObj = { loan_agreement_doc: loanData.loan_agreement_doc };
            const result = await prepareS3Image(inputObj, "loan_agreement_doc", "loan_agreement_doc");
            loanData.loan_agreement_doc_s3_image = result.loan_agreement_doc_s3_image || null;
        }

        return responseUtils.success(res, loanData, "Loan fetched successfully");
    } catch (error) {
        // ... error handling ...
    }
}

// In disburseLoan() method
async disburseLoan(req, res) {
    try {
        // ... existing code to create loan and receivables ...
        
        const newLoan = await DcLoan.create({
            // ... your loan data ...
        });

        const loanData = newLoan.toJSON();
        
        // Convert loan_agreement_doc to signed URL if present
        if (loanData.loan_agreement_doc) {
            const inputObj = { loan_agreement_doc: loanData.loan_agreement_doc };
            const result = await prepareS3Image(inputObj, "loan_agreement_doc", "loan_agreement_doc");
            loanData.loan_agreement_doc_s3_image = result.loan_agreement_doc_s3_image || null;
        }

        return responseUtils.success(res, loanData, "Loan disbursed successfully");
    } catch (error) {
        // ... error handling ...
    }
}
```

---

### Alternative: Simpler Approach (Same as dc_company)

If `dc_company` uses a simpler pattern, you can follow that exact same pattern:

```javascript
// Check how dcCompanyController does it
// Look for prepareS3Image usage in:
// treasure-service-main/src/controllers/dcCompanyController.js

// Then apply the same pattern to dcLoanController.js
// The pattern should be:
inputObj = await prepareS3Image(inputObj, "loan_agreement_doc", "loan_agreement_doc");
// This automatically adds loan_agreement_doc_s3_image field
```

---

## 📋 Verification Steps

1. **Test GET /api/v1/dc/loans**
   - Check response for each loan
   - Verify `loan_agreement_doc_s3_image` field exists when `loan_agreement_doc` is present
   - Verify the signed URL is valid and accessible

2. **Test GET /api/v1/dc/loans/:id**
   - Check single loan response
   - Verify `loan_agreement_doc_s3_image` field exists

3. **Test Frontend**
   - Navigate to `/daily-collection/user/loans`
   - Click "Download" button under "Loan Agreement"
   - Should open the PDF directly using the signed URL

---

## 🔍 Reference Implementation

Check how `dc_company` implements this:
- File: `treasure-service-main/src/controllers/dcCompanyController.js`
- Search for: `prepareS3Image`
- Field: `company_logo` → `company_logo_s3_image`

Then replicate the **exact same pattern** for:
- File: `treasure-service-main/src/controllers/dcLoanController.js`
- Field: `loan_agreement_doc` → `loan_agreement_doc_s3_image`

---

## 📝 Summary

**Backend Changes:**
1. Import `prepareS3Image` utility
2. Call `prepareS3Image(inputObj, "loan_agreement_doc", "loan_agreement_doc")` in all loan fetch methods
3. This automatically adds `loan_agreement_doc_s3_image` field to the response

**Frontend Changes:**
✅ Already completed - uses `loan_agreement_doc_s3_image` if available

---

## 🎯 Expected Result

After implementing:
- Backend returns `loan_agreement_doc_s3_image` field (just like `company_logo_s3_image`)
- Frontend uses this signed URL directly (no need to call `/get-signed-url` endpoint)
- Download works seamlessly without the previous error


