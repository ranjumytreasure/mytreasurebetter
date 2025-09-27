# Web vs Mobile API Comparison - Treasure App

## Overview

This document provides a detailed comparison between the Treasure Web Application API and the Treasure Mobile Application API, highlighting their differences, similarities, and use cases.

## Base Configuration Comparison

| Aspect | Web API | Mobile API |
|--------|---------|------------|
| **Base URL** | `https://mytreasure.in/api/v1` | `https://mytreasure.in/api/v1` |
| **Dev URL** | `https://treasure-services-mani.onrender.com/api/v1` | `https://treasure-mani.onrender.com/api/v1` |
| **Authentication** | Bearer Token (JWT) | Bearer Token (JWT) |
| **Content-Type** | `application/json` | `application/json` |

## API Endpoint Comparison

### 1. Authentication & User Management

| Feature | Web API | Mobile API | Notes |
|---------|---------|------------|-------|
| **Sign Up** | ✅ `/signup` | ❌ | Web only - full registration |
| **Sign In** | ✅ `/signin` | ✅ `/signin` | Both identical |
| **OTP Send** | ✅ `/users/send-otp` | ✅ `/users/send-otp` | Both identical |
| **OTP Verify** | ✅ `/users/verify` | ✅ `/users/verify` | Both identical |
| **Forgot Password** | ✅ `/users/forgot-password` | ✅ `/users/forgot-password` | Both identical |
| **User Profile** | ✅ `/users` | ✅ `/users/id/` | Different endpoints |
| **Profile Update** | ✅ `PUT /users` | ✅ `PUT /users` | Both identical |

### 2. Group Management

| Feature | Web API | Mobile API | Notes |
|---------|---------|------------|-------|
| **Get User Groups** | ✅ `/users/groups` | ❌ | Web only - full group list |
| **Get Group Details** | ✅ `/users/groups/{id}` | ✅ `/subscribers/groups/{id}/{subId}` | Different structure |
| **Group Dashboard** | ❌ | ✅ `/subscribers/groups/dashboard` | Mobile only - progress filtering |
| **Create Group** | ✅ `POST /groups` | ❌ | Web only - admin function |
| **Group Subscribers** | ✅ `/groups/{id}/subscribers` | ❌ | Web only - admin function |
| **Group Commission** | ✅ `POST /group-commision` | ❌ | Web only - admin function |

### 3. Subscriber Management

| Feature | Web API | Mobile API | Notes |
|---------|---------|------------|-------|
| **Get All Subscribers** | ✅ `/subscribers` | ❌ | Web only - admin function |
| **Get Subscriber Details** | ✅ `/subscribers/{id}` | ❌ | Web only - admin function |
| **Create Subscriber** | ✅ `POST /subscribers` | ❌ | Web only - admin function |
| **Multi-step Creation** | ✅ `POST /multistepsubscriber` | ❌ | Web only - admin function |
| **Confirm Invite** | ❌ | ✅ `POST /subscribers/confirm-invite` | Mobile only |
| **Update Subscriber** | ✅ `PUT /subscribers/{id}/section` | ❌ | Web only - admin function |

### 4. Financial Management

| Feature | Web API | Mobile API | Notes |
|---------|---------|------------|-------|
| **Receivables** | ✅ `GET /receipts` | ❌ | Web only - admin function |
| **Payables** | ✅ `GET /payments-receipts` | ❌ | Web only - admin function |
| **Create Receipt** | ✅ `POST /receipts` | ❌ | Web only - admin function |
| **Create Payment** | ✅ `POST /payments-receipts` | ❌ | Web only - admin function |
| **Transaction Dashboard** | ❌ | ✅ `/subscribers/group-transactions/dashboard` | Mobile only - subscriber view |
| **User Due** | ✅ `/groups/{id}/your-due` | ❌ | Web only |
| **Customer Due** | ✅ `/groups/{id}/customer-due` | ❌ | Web only |

### 5. Ledger Management

| Feature | Web API | Mobile API | Notes |
|---------|---------|------------|-------|
| **Get Ledger Entries** | ✅ `/ledger/entry/{id}` | ❌ | Web only - admin function |
| **Create Ledger Entry** | ✅ `POST /ledger/entry` | ❌ | Web only - admin function |
| **Update Ledger Entry** | ✅ `PUT /ledger/entry/{id}` | ❌ | Web only - admin function |

### 6. Billing & Subscription

| Feature | Web API | Mobile API | Notes |
|---------|---------|------------|-------|
| **Current Subscription** | ✅ `/billing-subscription/{id}` | ❌ | Web only - admin function |
| **Payment History** | ✅ `/billing-payments/{id}` | ❌ | Web only - admin function |
| **Available Plans** | ✅ `/billing-subscription/plans/available` | ❌ | Web only - admin function |
| **Change Plan** | ✅ `POST /billing-subscription/change-plan` | ❌ | Web only - admin function |
| **Record Payment** | ✅ `POST /billing-payments` | ❌ | Web only - admin function |

### 7. Product Management

| Feature | Web API | Mobile API | Notes |
|---------|---------|------------|-------|
| **Get Products** | ✅ `GET /products` | ❌ | Web only - admin function |
| **Create Product** | ✅ `POST /products` | ❌ | Web only - admin function |
| **Update Product** | ✅ `PUT /products/{id}` | ❌ | Web only - admin function |
| **Delete Product** | ✅ `DELETE /products/{id}` | ❌ | Web only - admin function |
| **Filter Products** | ✅ `GET /products/filter` | ❌ | Web only - admin function |

### 8. Employee Management

| Feature | Web API | Mobile API | Notes |
|---------|---------|------------|-------|
| **Get All Employees** | ✅ `GET /employee/all` | ❌ | Web only - admin function |
| **Create Employee** | ✅ `POST /employee` | ❌ | Web only - admin function |
| **Delete Employee** | ✅ `DELETE /employee/{id}` | ❌ | Web only - admin function |
| **Get Employee Details** | ✅ `GET /employee/{id}` | ❌ | Web only - admin function |

### 9. AOB Management

| Feature | Web API | Mobile API | Notes |
|---------|---------|------------|-------|
| **Get All AOBs** | ✅ `GET /aob/all` | ❌ | Web only - admin function |
| **Create AOB** | ✅ `POST /aob` | ❌ | Web only - admin function |
| **Delete AOB** | ✅ `DELETE /aob/{id}` | ❌ | Web only - admin function |

### 10. Auction Management

| Feature | Web API | Mobile API | Notes |
|---------|---------|------------|-------|
| **Get Auction Details** | ❌ | ✅ `GET /auctions/{id}` | Mobile only |
| **Post Auction Bid** | ❌ | ✅ `POST /auctions` | Mobile only |

### 11. File Management

| Feature | Web API | Mobile API | Notes |
|---------|---------|------------|-------|
| **Upload Image** | ✅ `POST /images/update` | ✅ `POST /file-upload/` | Different endpoints |
| **Get Image URL** | ✅ `GET /get-signed-url` | ✅ `GET /get-signed-url` | Both identical |

## Data Structure Differences

### User Data Structure

#### Web API User Object
```javascript
{
  results: {
    token: "string",
    firstname: "string",
    lastname: "string",
    phone: "string",
    userAccounts: [
      {
        accountName: "string",
        parent_membership_id: "string"
      }
    ],
    userCompany: {
      // Company details
    }
  }
}
```

#### Mobile API User Object
```kotlin
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
```

### Group Data Structure

#### Web API Group Response
```javascript
{
  results: {
    groups: array,
    premium: array,
    profits: array
  }
}
```

#### Mobile API Group Response
```kotlin
data class GroupDataResponse(
    val results: GroupDetails
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
```

## Key Architectural Differences

### 1. User Role Focus

| Aspect | Web API | Mobile API |
|--------|---------|------------|
| **Primary Users** | Administrators, Managers, Accountants | Subscribers, End Users |
| **Access Level** | Full system access | Limited to own data |
| **Functionality** | Complete CRUD operations | Read-only + specific actions |

### 2. Data Scope

| Aspect | Web API | Mobile API |
|--------|---------|------------|
| **Data Access** | All users, groups, transactions | Own groups and transactions only |
| **Administrative** | Full admin functions | No admin functions |
| **Reporting** | Comprehensive reporting | Personal dashboard only |

### 3. Performance Considerations

| Aspect | Web API | Mobile API |
|--------|---------|------------|
| **Data Volume** | Large datasets | Optimized for mobile |
| **Pagination** | Optional | Required for transactions |
| **Caching** | Server-side | Client-side (SharedPreferences) |
| **Offline Support** | Limited | Built-in offline capabilities |

## Use Case Scenarios

### Web API Use Cases
1. **Administrative Management**
   - Creating and managing groups
   - Adding/removing subscribers
   - Managing employees and AOBs
   - Financial reporting and ledger management

2. **Business Operations**
   - Billing and subscription management
   - Product catalog management
   - Comprehensive financial tracking
   - Multi-role user management

3. **Reporting & Analytics**
   - Dashboard with full system overview
   - Financial summaries and reports
   - User activity tracking
   - Business intelligence

### Mobile API Use Cases
1. **Subscriber Experience**
   - Viewing personal group participation
   - Tracking individual transactions
   - Participating in auctions
   - Managing personal profile

2. **Real-time Engagement**
   - Live auction participation
   - Push notifications
   - Real-time updates
   - Mobile-optimized interface

3. **Personal Management**
   - Profile management
   - Transaction history
   - Group progress tracking
   - Invitation management

## Security Differences

| Aspect | Web API | Mobile API |
|--------|---------|------------|
| **Access Control** | Role-based (RBAC) | User-based |
| **Data Exposure** | Full system data | User-specific data only |
| **Admin Functions** | Full access | No access |
| **Token Management** | Session-based | Persistent storage |

## Integration Considerations

### 1. Shared Endpoints
- Authentication endpoints are identical
- Image management endpoints are similar
- Basic user profile management is shared

### 2. Complementary Functionality
- Web API handles administrative functions
- Mobile API handles user-facing functions
- Both work together for complete system functionality

### 3. Data Consistency
- Both APIs use the same backend database
- User authentication is shared
- Data updates from either API are reflected in both

## Recommendations

### 1. For Web Development
- Use Web API for administrative interfaces
- Implement comprehensive role-based access control
- Focus on data management and reporting features
- Provide full CRUD operations for all entities

### 2. For Mobile Development
- Use Mobile API for user-facing applications
- Implement offline-first architecture
- Focus on user experience and real-time features
- Optimize for mobile performance and battery life

### 3. For Full-Stack Development
- Use both APIs complementarily
- Implement shared authentication
- Ensure data consistency across platforms
- Provide seamless user experience across web and mobile

This comparison highlights that the Web API is designed for comprehensive system management while the Mobile API is optimized for end-user experience and mobile-specific functionality.
