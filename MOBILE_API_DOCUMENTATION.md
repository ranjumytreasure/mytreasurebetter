# Treasure Mobile App API Documentation

## Overview

The Treasure Mobile App is an Android application built with Kotlin that provides a subscriber-focused interface for the Treasure financial management system. The mobile app has a more streamlined API compared to the web application, focusing on subscriber-specific functionality.

## Base Configuration

### API Base URLs
- **Production**: `https://mytreasure.in/api/v1/`
- **Development**: `https://treasure-mani.onrender.com/api/v1/`

### Authentication
- **Method**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer {token}`
- **Content-Type**: `application/json`

## Mobile API Endpoints

### 1. Authentication & User Management

#### Send OTP
- **POST** `/users/send-otp`
- **Body**: `{ "phone": "string" }`
- **Response**: `SendOtpResponse`
- **Purpose**: Send OTP for phone verification

#### Verify OTP
- **POST** `/users/verify`
- **Body**: `{ "phone": "string", "otp": "string" }`
- **Response**: Verification status
- **Purpose**: Verify phone number with OTP

#### Sign In
- **POST** `/signin`
- **Body**: `{ "phone": "string", "password": "string" }`
- **Response**: `SignInResponse`
- **Purpose**: User authentication

#### Forgot Password
- **PUT** `/users/forgot-password`
- **Body**: `{ "phone": "string", "otp": "string", "newPassword": "string" }`
- **Response**: Password reset confirmation
- **Purpose**: Reset user password

#### Get User Profile
- **GET** `/users/id/`
- **Headers**: Authorization required
- **Response**: `UserProfileResponse`
- **Purpose**: Get user profile details

#### Update Profile
- **PUT** `/users`
- **Headers**: Authorization required
- **Body**: User profile data
- **Response**: `UpdateProfileResponse`
- **Purpose**: Update user profile information

### 2. Group Management (Subscriber Focus)

#### Get Group Dashboard Data
- **GET** `/subscribers/groups/dashboard?progress={groupType}`
- **Headers**: Authorization required
- **Query Parameters**: 
  - `progress`: Group progress type (inProgress, future, completed)
- **Response**: `GroupDataResponse`
- **Purpose**: Get subscriber's groups with progress filtering

#### Get Group Details
- **GET** `/subscribers/groups/{groupId}/{grpSubscriberId}`
- **Headers**: Authorization required
- **Response**: `GroupDetailsResponse`
- **Purpose**: Get detailed information about a specific group

### 3. Transaction Management

#### Get Transaction Dashboard
- **GET** `/subscribers/group-transactions/dashboard?page=1&size={count}`
- **Headers**: Authorization required
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `size`: Number of transactions per page
- **Response**: `TransDataResponse`
- **Purpose**: Get paginated transaction history

### 4. Auction Management

#### Get Auction Details
- **GET** `/auctions/{groupAccountId}`
- **Headers**: Authorization required
- **Response**: `AuctionDetailsResponse`
- **Purpose**: Get auction details for a specific group account

#### Post Auction Bid
- **POST** `/auctions`
- **Headers**: Authorization required
- **Body**: Auction bid data
- **Response**: `PostAuctionResponse`
- **Purpose**: Submit auction bid

### 5. File Management

#### Upload Image
- **POST** `/file-upload/`
- **Headers**: Authorization required
- **Body**: Image file data
- **Response**: `UploadImageResponse`
- **Purpose**: Upload profile or other images

#### Get Image URL
- **GET** `/get-signed-url?key={imageKey}`
- **Headers**: Authorization required
- **Response**: `ProfileImageResponse`
- **Purpose**: Get signed URL for image access

### 6. Invitation Management

#### Confirm Invite
- **POST** `/subscribers/confirm-invite`
- **Body**: Invitation confirmation data
- **Response**: `ConfirmInviteResponse`
- **Purpose**: Confirm group invitation

## Data Structures

### SignInResponse
```kotlin
data class SignInResponse(
    val message: String,
    val error: Boolean,
    val code: Int,
    val results: UserDetails,
    val date: String
)

data class UserDetails(
    val userId: String,
    val firstname: String?,
    val lastname: String?,
    val email: String?,
    val phone: String,
    val phone_verified: Boolean,
    val dob: String?,
    val gender: String?,
    val user_image: String?,
    val is_online: Boolean?,
    val source_system: String?,
    val status: Int,
    val loginId: String,
    val token: String,
    val userAccounts: List<UserAccount>,
    val userCompany: UserCompanyData
)

data class UserAccount(
    val membershipId: Int,
    val accountId: Int,
    val accountName: String
)

data class UserCompanyData(
    val id: String,
    val name: String,
    val registration_no: String,
    val tagline: String,
    val logo: String,
    val company_since: String,
    val membership_id: Int,
    val street_address: String,
    val city: String,
    val state: String,
    val zipcode: Int,
    val country: String,
    val country_code: String,
    val email: String,
    val phone: String,
    val latitude: Int,
    val longitude: Int,
    val source_system: String,
    val created_by: String,
    val updated_by: String,
    val created_at: String,
    val updated_at: String,
    val logo_s3_image: String,
    val logo_base64format: String
)
```

### GroupDataResponse
```kotlin
data class GroupDataResponse(
    val message: String,
    val error: Boolean,
    val code: Int,
    val results: GroupDetails,
    val date: String
)

data class GroupDetails(
    val groupProgress: GroupProgress,
    val groupInfo: ArrayList<GroupInfo>
)

data class GroupProgress(
    val inProgressCount: Int,
    val futureCount: Int,
    val completedCount: Int
)

data class GroupInfo(
    val groupId: String,
    val amount: Int,
    val isGovApproved: Boolean,
    val groupSubscriberId: Int,
    val auctionDate: String,
    val groupProgress: String,
    val groupType: String
)
```

### GroupDetailsResponse
```kotlin
data class GroupDetailsResponse(
    val message: String,
    val error: Boolean,
    val code: Int,
    val results: GroupDetail,
    val date: String
)

data class GroupDetail(
    val groupName: String,
    val amount: Int,
    val type: String,
    val isGovApproved: Boolean,
    val startDate: String,
    val endDate: String,
    val commissionAmount: Int,
    val commissionType: String,
    val totalGroups: Int,
    val groupsCompleted: String,
    val auctionStatus: String,
    val bidStatus: String,
    val groupAccountId: String,
    val auctionDate: String,
    val groupUserId: String,
    val groupId: String,
    val totalDue: Int,
    val profit: Double,
    val transactionInfo: ArrayList<TransactionInfo>,
    val groupTransactionInfo: ArrayList<GroupTransactionInfo>,
    val outstandingAdvanceTransactionInfo: ArrayList<TransactionInfo>,
    val totalGroupOutstanding: Int,
    val totalAdvanceOutstandingAmount: String
)

data class TransactionInfo(
    val date: String,
    val amount: Int,
    val status: String
)

data class GroupTransactionInfo(
    val date: String,
    val auctionAmount: Int,
    val commision: String,
    val profit: Double,
    val reserve: String,
    val customerDue: Int,
    val sno: Int,
    val type: String,
    val auctionStatus: String,
    val prizeMoney: String
)
```

### TransDataResponse
```kotlin
data class TransDataResponse(
    val message: String,
    val error: Boolean,
    val code: Int,
    val results: Results,
    val date: String
)

data class Results(
    val totalItems: Int,
    val totalPages: Int,
    val currentPage: Int,
    val transactions: ArrayList<Transaction>
)

data class Transaction(
    val name: String?,
    val payment_method: String,
    val payment_type: String,
    val payment_amount: Int,
    val payment_status: String,
    val created_at: String,
    val arrow: String
)
```

### AuctionDetailsResponse
```kotlin
data class AuctionDetailsResponse(
    val message: String,
    val error: Boolean,
    val code: Int,
    val results: ArrayList<AuctionResult>,
    val date: String
)

data class AuctionResult(
    val auctionId: Int,
    val group_accounts_id: String,
    val groupId: String,
    val amount: Int,
    val subscriberId: String,
    val grpUserId: String,
    val name: String,
    val created_at: String,
    val user_image: String
)
```

### PostAuctionResponse
```kotlin
data class PostAuctionResponse(
    val message: String,
    val error: Boolean,
    val code: Int,
    val results: AuctionDetails,
    val date: String
)

data class AuctionDetails(
    val group_id: String,
    val subscriber_id: String,
    val user_id: String,
    val amount: Int,
    val created_by: String,
    val updated_by: String,
    val auct_date: String,
    val group_accounts_id: String,
    val source_system: String
)
```

## Key Differences from Web API

### 1. Subscriber-Centric Approach
- Mobile API focuses on subscriber-specific endpoints (`/subscribers/...`)
- Web API has broader administrative and management endpoints
- Mobile API has simplified data structures for mobile consumption

### 2. Limited Administrative Functions
- Mobile app doesn't include:
  - Employee management
  - Billing/subscription management
  - Ledger management
  - Product management
  - AOB (Area of Business) management

### 3. Streamlined Group Management
- Mobile API provides group dashboard with progress filtering
- Simplified group details focused on subscriber perspective
- No group creation or administrative group management

### 4. Transaction Focus
- Mobile API emphasizes transaction history and dashboard
- Paginated transaction listing for better mobile performance
- Simplified transaction data structure

### 5. Auction Integration
- Mobile app has dedicated auction management
- Real-time auction participation
- Simplified auction data structures

## Error Handling

### Standard Response Format
```kotlin
{
    "message": "string",
    "error": boolean,
    "code": int,
    "results": object | array,
    "date": "string"
}
```

### Error Codes
- `401`: Unauthorized - Token expired or invalid
- `400`: Bad Request - Invalid request data
- `404`: Not Found - Resource not found
- `500`: Internal Server Error

### Authentication Handling
- Automatic token validation
- Redirect to login on 401 errors
- Token refresh mechanism (if implemented)

## Mobile-Specific Features

### 1. Offline Support
- Local data caching using SharedPreferences
- Offline transaction queuing
- Sync when connection restored

### 2. Push Notifications
- Auction notifications
- Payment reminders
- Group updates

### 3. Image Handling
- Profile image upload
- S3 signed URL generation
- Image compression for mobile

### 4. Multi-language Support
- English, Kannada, Tamil support
- Localized strings and dimensions
- RTL support considerations

## Security Considerations

### 1. Token Management
- Secure token storage in SharedPreferences
- Automatic token refresh
- Token invalidation on logout

### 2. Data Protection
- Input validation
- Secure API communication (HTTPS)
- Local data encryption

### 3. User Privacy
- Minimal data collection
- Secure image handling
- Privacy-compliant data storage

## Performance Optimizations

### 1. Network Optimization
- Request timeouts (15 seconds)
- Connection pooling
- Response caching

### 2. Data Optimization
- Paginated responses
- Compressed image uploads
- Minimal data transfer

### 3. UI Performance
- Lazy loading
- RecyclerView optimization
- Image caching

This mobile API documentation provides a comprehensive overview of the Treasure Mobile App's API structure, focusing on the subscriber-centric approach and mobile-optimized endpoints.
