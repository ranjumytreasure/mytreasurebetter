# Loan Agreement Document Upload - Complete Implementation Plan

## 📋 Business Workflow

1. **Generate** → Loan agreement PDF generated in frontend
2. **Download** → User downloads PDF to print and sign
3. **Sign** → User signs the physical document
4. **Scan/Upload** → User scans and uploads signed document (PDF or Image)
5. **Store** → Backend stores S3 key in `loan_agreement_doc` field
6. **Retrieve** → Frontend uses signed URL from backend to download/view

---

## 🎯 Implementation Requirements

### **File Types to Support:**
- ✅ **PDF** - Scanned signed agreements (most common)
- ✅ **Images** - JPEG, PNG (scanned/photographed documents)

### **Key Requirements:**
1. Detect file type (PDF vs Image)
2. Handle PDFs without compression (keep original quality)
3. Compress images (reduce storage, maintain quality)
4. Set correct `ContentType` for S3 (critical for downloads)
5. Store S3 **key** (not full URL) in database
6. Generate signed URLs for secure access

---

## 🔧 Backend Implementation

### **1. Update `s3Service.js` - Make ContentType Dynamic**

**File:** `treasure-service-main/src/service/s3Service.js`

```javascript
// Upload to S3 with dynamic ContentType
exports.uploadToS3 = (fileName, fileBuffer, contentType = "image/jpeg") => {
  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType, // Dynamic based on file type
  };

  return s3.upload(params).promise();
};
```

**Changes:**
- Add `contentType` parameter (default to "image/jpeg" for backward compatibility)
- Set `ContentType` dynamically based on file type

---

### **2. Create New Upload Endpoint - `uploadDocument.js`**

**File:** `treasure-service-main/src/controllers/documentController.js` (NEW FILE)

```javascript
const path = require("path");
const sharp = require("sharp");
const { uploadToS3 } = require("../service/s3Service");

// Helper function to detect file type and set ContentType
function getContentType(fileName, mimetype) {
  const ext = path.extname(fileName).toLowerCase();
  
  // Check by extension first
  if (ext === '.pdf') return 'application/pdf';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  
  // Fallback to mimetype if available
  if (mimetype) return mimetype;
  
  // Default fallback
  return 'application/octet-stream';
}

// Upload document (supports both PDF and Images)
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;
    const contentType = getContentType(file.originalname, file.mimetype);
    const isPdf = contentType === 'application/pdf';
    const isImage = contentType.startsWith('image/');

    let fileBuffer = file.buffer;
    let fileName = `${Date.now()}${path.extname(file.originalname)}`;

    // For images: compress and optimize
    if (isImage) {
      try {
        fileBuffer = await sharp(file.buffer)
          .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true }) // Max 1920px
          .jpeg({ quality: 85 }) // Good quality with compression
          .toBuffer();
        fileName = `compressed-${fileName}`;
      } catch (error) {
        console.error('Image compression failed, using original:', error);
        // If Sharp fails (non-image trying to compress), use original
        fileBuffer = file.buffer;
      }
    }

    // For PDFs: use original buffer (no compression)
    // For compressed images: use compressed buffer

    // Upload to S3 with correct ContentType
    const s3Response = await uploadToS3(fileName, fileBuffer, contentType);

    // Return S3 key (not full URL) for signed URL generation
    // The key will be used by prepareS3Image to generate signed URLs
    res.status(200).json({
      message: "Document uploaded successfully",
      imageUrl: s3Response.Location, // Keep for backward compatibility
      key: fileName, // S3 key to store in database
      contentType: contentType,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ message: "Failed to upload document" });
  }
};
```

**Key Features:**
- ✅ Detects file type (PDF vs Image)
- ✅ Compresses images (maintains quality)
- ✅ Keeps PDFs original (no compression)
- ✅ Sets correct `ContentType`
- ✅ Returns both `imageUrl` (full URL) and `key` (S3 key)

---

### **3. Update Routes**

**File:** `treasure-service-main/src/routes/index.js` or create `documentRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const documentController = require('../controllers/documentController');
const multerConfig = require('../config/multer.config');

// Upload document (PDF or Image)
router.post(
  '/documents/upload',
  multer(multerConfig).single('document'), // Use 'document' field name
  documentController.uploadDocument
);

module.exports = router;
```

**Add to main routes file:**
```javascript
app.use('/api/v1', documentRoutes);
```

---

### **4. Update `prepareS3Image.js` - Handle Both Keys and URLs**

**File:** `treasure-service-main/src/utils/prepareS3Image.js`

The function already extracts key from URL using `.split('/').pop()`, which should work for both:
- Full URLs: `https://bucket.s3.region.amazonaws.com/key.pdf` → extracts `key.pdf`
- Just keys: `compressed-1234567890.pdf` → extracts `compressed-1234567890.pdf`

**No changes needed** - it already handles both cases!

---

## 📱 Frontend Implementation

### **1. Update `uploadImage.js` Utility - Support Documents**

**File:** `src/utils/uploadImage.js`

```javascript
export const uploadImage = async (file, apiBaseUrl, setErrorMessage) => {
    try {
        if (!file || !(file instanceof File)) {
            throw new Error("Invalid file. Please select a valid file.");
        }

        const formData = new FormData();
        formData.append("image", file); // Keep 'image' for backward compatibility

        const response = await fetch(`${apiBaseUrl}/images/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to upload file");
        }

        const responseData = await response.json();
        return responseData.imageUrl; // Returns full S3 URL
    } catch (error) {
        console.error("File upload error:", error);
        if (setErrorMessage) {
            setErrorMessage(error.message || "File upload failed. Try again.");
        }
        return null;
    }
};

// NEW: Upload document (PDF or Image) - uses new endpoint
export const uploadDocument = async (file, apiBaseUrl, setErrorMessage) => {
    try {
        if (!file || !(file instanceof File)) {
            throw new Error("Invalid file. Please select a valid document.");
        }

        // Validate file type
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        const isPdf = fileName.endsWith('.pdf') || fileType === 'application/pdf';
        const isImage = fileType.startsWith('image/');

        if (!isPdf && !isImage) {
            throw new Error("Only PDF and image files are allowed.");
        }

        const formData = new FormData();
        formData.append("document", file); // Use 'document' for new endpoint

        const response = await fetch(`${apiBaseUrl}/documents/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to upload document");
        }

        const responseData = await response.json();
        // Return S3 key (preferred) or full URL (fallback)
        return responseData.key || responseData.imageUrl;
    } catch (error) {
        console.error("Document upload error:", error);
        if (setErrorMessage) {
            setErrorMessage(error.message || "Document upload failed. Try again.");
        }
        return null;
    }
};
```

---

### **2. Update `LoanDisbursementForm.js` - Use New Upload Function**

**File:** `src/components/dailyCollection/LoanDisbursementForm.js`

**Change line 201:**
```javascript
// OLD:
const imageUrl = await uploadImage(agreementFile, API_BASE_URL);

// NEW:
import { uploadDocument } from '../../utils/uploadImage'; // Add import
const documentKey = await uploadDocument(agreementFile, API_BASE_URL);
```

**Update the API call to store the key:**
```javascript
body: JSON.stringify({
    loan_agreement_doc: documentKey // Store S3 key, not full URL
})
```

---

### **3. Ensure Frontend Uses Signed URLs**

**Already implemented in `LoansPage.js`:**
- ✅ Checks for `loan_agreement_doc_s3_image` first
- ✅ Falls back to original field if needed

---

## 📊 Database Storage

### **Current State:**
- Field: `loan_agreement_doc` (TEXT)
- Currently stores: Full S3 URL or S3 key (inconsistent)

### **Recommended:**
- Store: **S3 key only** (e.g., `compressed-1762014073084.pdf`)
- Backend generates signed URLs on-the-fly using `prepareS3Image`
- More secure (expiring URLs)
- Consistent with `company_logo` pattern

---

## ✅ Implementation Checklist

### **Backend:**
- [ ] Update `s3Service.js` - Add contentType parameter
- [ ] Create `documentController.js` - New upload endpoint
- [ ] Add routes for `/documents/upload`
- [ ] Test PDF upload
- [ ] Test Image upload
- [ ] Verify ContentType is set correctly
- [ ] Verify signed URLs work for both PDFs and images

### **Frontend:**
- [ ] Add `uploadDocument` function to `uploadImage.js`
- [ ] Update `LoanDisbursementForm.js` to use `uploadDocument`
- [ ] Add file type validation (PDF/Image only)
- [ ] Test PDF upload flow
- [ ] Test Image upload flow
- [ ] Verify download works with signed URLs

### **Testing:**
- [ ] Upload PDF → Verify in S3 → Verify ContentType
- [ ] Upload Image → Verify compression → Verify ContentType
- [ ] Download PDF using signed URL
- [ ] Download Image using signed URL
- [ ] Test with existing loans (backward compatibility)

---

## 🔍 Key Differences from Current Implementation

| Aspect | Current (Image Only) | New (PDF + Image) |
|--------|---------------------|-------------------|
| **Endpoint** | `/images/upload` | `/documents/upload` |
| **File Types** | Images only | PDF + Images |
| **Compression** | Always compresses | Images: Yes, PDFs: No |
| **ContentType** | Hardcoded `image/jpeg` | Dynamic based on file type |
| **Storage** | Full URL or key | S3 key (consistent) |
| **Signed URLs** | Via `prepareS3Image` | Via `prepareS3Image` (same) |

---

## 🚀 Migration Strategy

### **Option 1: Update Existing Endpoint (Recommended)**
Update `/images/upload` to handle both images and PDFs:
- Detect file type
- Route to appropriate processing
- Return consistent format

### **Option 2: Create New Endpoint (Cleaner)**
Create `/documents/upload` for loan agreements:
- Keep `/images/upload` for backward compatibility
- Use new endpoint specifically for documents
- Gradual migration

**Recommendation:** Option 2 (new endpoint) - cleaner separation, easier to maintain

---

## 🐛 Current Issue Fix

**Problem:** AccessDenied when accessing S3 URL directly

**Root Cause:** 
1. ContentType is wrong (`image/jpeg` for PDF)
2. Direct S3 URL access (not using signed URLs)
3. File might have wrong permissions

**Solution:**
1. Fix ContentType based on file type
2. Always use signed URLs (via `prepareS3Image`)
3. Ensure S3 key is stored (not full URL) for signed URL generation

---

## 📝 Summary

**Recommended Approach:**
1. **Upload:** Use new `/documents/upload` endpoint that handles PDFs and images
2. **Storage:** Store S3 key (not full URL) in `loan_agreement_doc`
3. **Download:** Backend generates signed URLs via `prepareS3Image` (already implemented)
4. **Frontend:** Use `loan_agreement_doc_s3_image` from backend response (already implemented)

**This approach:**
- ✅ Supports both PDFs and images
- ✅ Maintains file quality
- ✅ Uses secure signed URLs
- ✅ Consistent with company logo pattern
- ✅ Backward compatible


