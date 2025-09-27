# Treasure App API Documentation

## Base Configuration

### API Base URLs
- **Production**: `https://mytreasure.in/api/v1`
- **Development**: `https://treasure-services-mani.onrender.com/api/v1`

### WebSocket URLs
- **Production**: `wss://mytreasure.in`
- **Development**: `wss://treasure-services-mani.onrender.com`

## Authentication

### Headers
All authenticated requests require:
```
Authorization: Bearer {token}
Content-Type: application/json
```

## API Endpoints

### 1. Authentication & User Management

#### Sign Up
- **POST** `/signup`
- **Body**: `{ phone, password, ... }`
- **Response**: User object with token

#### Sign In
- **POST** `/signin`
- **Body**: `{ phone, password }`
- **Response**: User object with token and userAccounts

#### OTP Verification
- **POST** `/users/verify`
- **Body**: `{ phone, otp }`
- **Response**: Verification status

#### Send OTP
- **POST** `/users/send-otp`
- **Body**: `{ phone }`
- **Response**: OTP sent confirmation

#### Forgot Password
- **POST** `/users/forgot-password`
- **Body**: `{ phone, otp, newPassword }`
- **Response**: Password reset confirmation

#### Update User
- **PUT** `/users`
- **Headers**: Authorization required
- **Body**: User details
- **Response**: Updated user object

### 2. Groups Management

#### Get User Groups
- **GET** `/users/groups`
- **Headers**: Authorization required
- **Response**: Array of user groups with premium and profit data

#### Get Group Details
- **GET** `/users/groups/{groupId}`
- **Headers**: Authorization required
- **Response**: Detailed group information

#### Create Group
- **POST** `/groups`
- **Headers**: Authorization required
- **Body**: Group creation data
- **Response**: Created group object

#### Get Group Subscribers
- **GET** `/groups/{groupId}/subscribers`
- **Headers**: Authorization required
- **Response**: Array of group subscribers

#### Group Commission
- **POST** `/group-commision`
- **Headers**: Authorization required
- **Body**: Commission data
- **Response**: Commission calculation

### 3. Subscribers Management

#### Get All Subscribers
- **GET** `/subscribers`
- **Headers**: Authorization required
- **Response**: Array of subscribers

#### Get Subscriber Details
- **GET** `/subscribers/{subscriberId}`
- **Headers**: Authorization required
- **Response**: Detailed subscriber information

#### Create Subscriber
- **POST** `/subscribers`
- **Headers**: Authorization required
- **Body**: Subscriber data
- **Response**: Created subscriber object

#### Multi-step Subscriber Creation
- **POST** `/multistepsubscriber`
- **Headers**: Authorization required
- **Body**: Complete subscriber data
- **Response**: Created subscriber object

#### Update Subscriber Section
- **PUT** `/subscribers/{subscriberId}/section`
- **Headers**: Authorization required
- **Body**: Section data
- **Response**: Updated section

#### Add Subscriber Area
- **POST** `/addSubscriberArea`
- **Headers**: Authorization required
- **Body**: Area data
- **Response**: Area assignment confirmation

### 4. Group Subscribers

#### Get Group Subscriber
- **GET** `/groupsubscribers/{id}`
- **Headers**: Authorization required
- **Response**: Group subscriber details

#### Update Group Subscriber
- **PUT** `/groupsubscribers/{groupId}/{subscriberId}/{groupSubscriberId}`
- **Headers**: Authorization required
- **Body**: Update data
- **Response**: Updated group subscriber

### 5. Financial Management

#### Receivables
- **GET** `/receipts`
- **Headers**: Authorization required
- **Response**: Array of receivables

#### Payables
- **GET** `/payments-receipts`
- **Headers**: Authorization required
- **Response**: Array of payables

#### Create Receipt
- **POST** `/receipts`
- **Headers**: Authorization required
- **Body**: Receipt data
- **Response**: Created receipt

#### Create Payment Receipt
- **POST** `/payments-receipts`
- **Headers**: Authorization required
- **Body**: Payment data
- **Response**: Created payment receipt

### 6. Ledger Management

#### Get Ledger Entries
- **GET** `/ledger/entry/{membershipId}?{queryParams}`
- **Headers**: Authorization required
- **Query Parameters**: date_from, date_to, account_id, etc.
- **Response**: Array of ledger entries

#### Create Ledger Entry
- **POST** `/ledger/entry`
- **Headers**: Authorization required
- **Body**: Entry data
- **Response**: Created entry

#### Update Ledger Entry
- **PUT** `/ledger/entry/{entryId}`
- **Headers**: Authorization required
- **Body**: Update data
- **Response**: Updated entry

### 7. Billing & Subscription

#### Get Current Subscription
- **GET** `/billing-subscription/{membershipId}`
- **Headers**: Authorization required
- **Response**: Current subscription details

#### Get Payment History
- **GET** `/billing-payments/{membershipId}`
- **Headers**: Authorization required
- **Response**: Payment history with cycle_payments

#### Get Available Plans
- **GET** `/billing-subscription/plans/available`
- **Headers**: Authorization required
- **Response**: Array of available subscription plans

#### Change Plan
- **POST** `/billing-subscription/change-plan`
- **Headers**: Authorization required
- **Body**: `{ membership_id, ...planChangeData }`
- **Response**: Plan change confirmation

#### Record Payment
- **POST** `/billing-payments`
- **Headers**: Authorization required
- **Body**: `{ membership_id, ...paymentData }`
- **Response**: Payment recording confirmation

#### Pay Cycle Bill
- **POST** `/billing-payments/{membershipId}/pay-cycle`
- **Headers**: Authorization required
- **Body**: Cycle payment data
- **Response**: Cycle payment confirmation

### 8. Products Management

#### Get Products
- **GET** `/products`
- **Headers**: Authorization required
- **Response**: Array of products

#### Create Product
- **POST** `/products`
- **Headers**: Authorization required
- **Body**: Product data
- **Response**: Created product

#### Update Product
- **PUT** `/products/{productId}`
- **Headers**: Authorization required
- **Body**: Update data
- **Response**: Updated product

#### Delete Product
- **DELETE** `/products/{productId}`
- **Headers**: Authorization required
- **Response**: Deletion confirmation

#### Filter Products
- **GET** `/products/filter?{queryParams}`
- **Headers**: Authorization required
- **Query Parameters**: Various filter options
- **Response**: Filtered products

### 9. Employee Management

#### Get All Employees
- **GET** `/employee/all`
- **Headers**: Authorization required
- **Response**: Array of employees

#### Create Employee
- **POST** `/employee`
- **Headers**: Authorization required
- **Body**: Employee data
- **Response**: Created employee

#### Delete Employee
- **DELETE** `/employee/{id}`
- **Headers**: Authorization required
- **Response**: Deletion confirmation

#### Get Employee Details
- **GET** `/employee/{employeeId}`
- **Headers**: Authorization required
- **Response**: Employee details

### 10. AOB (Area of Business) Management

#### Get All AOBs
- **GET** `/aob/all`
- **Headers**: Authorization required
- **Response**: Array of AOBs

#### Create AOB
- **POST** `/aob`
- **Headers**: Authorization required
- **Body**: AOB data
- **Response**: Created AOB

#### Delete AOB
- **DELETE** `/aob/{id}`
- **Headers**: Authorization required
- **Response**: Deletion confirmation

### 11. Company Management

#### Create Company
- **POST** `/company`
- **Headers**: Authorization required
- **Body**: Company data
- **Response**: Created company

### 12. Image Management

#### Update Image
- **POST** `/images/update`
- **Headers**: Authorization required
- **Body**: Image data
- **Response**: Image update confirmation

#### Get Signed URL
- **GET** `/get-signed-url?key={logoKey}`
- **Headers**: Authorization required
- **Response**: Signed URL for image access

### 13. Due Management

#### Get User Due
- **GET** `/groups/{groupId}/your-due`
- **Headers**: Authorization required
- **Response**: User's due information

#### Get Customer Due
- **GET** `/groups/{groupId}/customer-due`
- **Headers**: Authorization required
- **Response**: Customer due information

#### Get Customer Due by Subscriber
- **GET** `/groups/{groupId}/customer-due/{subscriberId}`
- **Headers**: Authorization required
- **Response**: Specific customer due

### 14. Group Account Details

#### Get Receivables Receipts
- **GET** `/group-accounts/{grpAccountId}/receivables-receipts`
- **Headers**: Authorization required
- **Response**: Receivables receipts for group account

### 15. WhatsApp Integration

#### Send Due Reminder
- **POST** `/whatsapp/due-reminder`
- **Headers**: Authorization required
- **Body**: Reminder data
- **Response**: Reminder sent confirmation

## Data Structures

### User Object
```javascript
{
  results: {
    token: "string",
    firstname: "string",
    lastname: "string",
    phone: "string",
    dob: "date",
    gender: "string",
    user_image: "string",
    userAccounts: [
      {
        accountName: "string",
        parent_membership_id: "string",
        // ... other account details
      }
    ],
    userCompany: {
      // ... company details
    }
  }
}
```

### Group Object
```javascript
{
  results: {
    id: "string",
    name: "string",
    description: "string",
    // ... other group details
  }
}
```

### Subscriber Object
```javascript
{
  id: "string",
  firstname: "string",
  lastname: "string",
  phone: "string",
  // ... other subscriber details
}
```

### Billing Subscription Object
```javascript
{
  subscription: {
    id: "string",
    plan_name: "string",
    status: "string",
    // ... other subscription details
  }
}
```

### Payment Object
```javascript
{
  cycle_payments: [
    {
      id: "string",
      amount: "number",
      status: "string",
      // ... other payment details
    }
  ]
}
```

## Error Handling

All API responses follow this structure:
```javascript
{
  success: boolean,
  message: "string",
  results: object | array,
  data: object | array
}
```

Error responses include:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Role-Based Access Control (RBAC)

The application supports multiple user roles:
- **User**: Full access to most features
- **Collector**: Limited to receivables and personal settings
- **Subscriber**: Menu access only
- **Accountant**: Financial and administrative access
- **Manager**: Full administrative access

## WebSocket Events

The application uses WebSocket for real-time updates:
- Connection URL: `wss://mytreasure.in` (production)
- Events: Real-time notifications, updates, and live data

## Rate Limiting

API endpoints may have rate limiting. Check response headers for:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
