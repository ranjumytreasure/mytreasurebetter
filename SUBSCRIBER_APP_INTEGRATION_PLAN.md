# Subscriber App Integration Plan - Treasure React Application

## Project Overview

This document outlines the plan to integrate the mobile app functionality into the existing React application as a customer-facing subscriber app. The goal is to create a seamless experience for subscribers without disturbing the existing user application.

## Current Application Structure

### Existing React App Structure
```
src/
├── App.js (Main application with routing)
├── components/ (Existing user components)
├── pages/ (Existing user pages)
├── context/ (Existing user contexts)
└── utils/ (Existing utilities)
```

### Proposed Integration Structure
```
src/
├── App.js (Updated with subscriber routing)
├── components/
│   ├── user/ (Existing user components - UNTOUCHED)
│   └── subscriber/ (New subscriber components)
├── pages/
│   ├── user/ (Existing user pages - UNTOUCHED)
│   └── subscriber/ (New subscriber pages)
├── context/
│   ├── user/ (Existing user contexts - UNTOUCHED)
│   └── subscriber/ (New subscriber contexts)
└── utils/
    ├── user/ (Existing user utilities - UNTOUCHED)
    └── subscriber/ (New subscriber utilities)
```

## API Analysis Summary

### Backend Service Endpoints Found

Based on the treasure-service analysis, the following mobile-specific APIs are available:

#### 1. Authentication APIs
- **POST** `/signin` - User login
- **POST** `/users/verify` - OTP verification
- **POST** `/users/send-otp` - Send OTP
- **PUT** `/users/forgot-password` - Password reset
- **GET** `/users/id` - Get user profile
- **PUT** `/users` - Update user profile

#### 2. Subscriber Dashboard APIs
- **GET** `/subscribers/groups/dashboard?progress={status}` - Group dashboard
- **GET** `/subscribers/group-transactions/dashboard?page={page}&size={size}` - Transaction dashboard
- **GET** `/subscribers/groups/{id}/{grpSubId}` - Group details

#### 3. Auction APIs
- **GET** `/auctions/{group_accounts_id}` - Get auction details
- **POST** `/auctions` - Place auction bid

#### 4. File Management APIs
- **POST** `/file-upload` - Upload images
- **GET** `/get-signed-url?key={imageKey}` - Get signed image URL

#### 5. Invitation APIs
- **POST** `/subscribers/confirm-invite` - Confirm group invitation

## Response Structure Analysis

### 1. Group Dashboard Response
```javascript
{
  message: "Subscriber group details",
  error: false,
  code: 200,
  results: {
    groupProgress: {
      inProgressCount: number,
      futureCount: number,
      completedCount: number
    },
    groupInfo: [
      {
        groupId: string,
        amount: number,
        isGovApproved: boolean,
        firstauctionDate: string,
        auctionDate: string,
        groupProgress: string,
        groupType: string,
        subscriberId: string,
        userId: string,
        groupSubscriberId: number
      }
    ]
  },
  date: string
}
```

### 2. Transaction Dashboard Response
```javascript
{
  message: "Subscriber group transaction details",
  error: false,
  code: 200,
  results: {
    totalItems: number,
    totalPages: number,
    currentPage: number,
    transactions: [
      {
        name: string,
        payment_method: string,
        payment_type: string,
        payment_amount: number,
        payment_status: string,
        created_at: string,
        arrow: "UP" | "DOWN"
      }
    ]
  },
  date: string
}
```

### 3. Group Details Response
```javascript
{
  message: "Subscriber group details",
  error: false,
  code: 200,
  results: {
    groupName: string,
    amount: number,
    type: string,
    isGovApproved: boolean,
    startDate: string,
    endDate: string,
    commissionAmount: number,
    commissionType: string,
    totalGroups: number,
    groupsCompleted: number,
    auctionStatus: string,
    groupAccountId: string,
    auctionDate: string,
    groupUserId: string,
    groupId: string,
    grpSubscriberId: number,
    bidStatus: "BIDTAKEN" | "BIDNOTTAKEN",
    totalDue: number,
    profit: number,
    totalAdvanceOutstandingAmount: number,
    totalGroupOutstanding: number,
    transactionInfo: [
      {
        date: string,
        amount: number,
        status: "Success" | "Due"
      }
    ],
    groupTransactionInfo: [
      {
        date: string,
        auctionAmount: number,
        commision: string,
        profit: number,
        reserve: string,
        customerDue: number,
        sno: number,
        type: string,
        auctionStatus: "completed" | "pending",
        prizeMoney: string
      }
    ],
    outstandingAdvanceTransactionInfo: [
      {
        date: string,
        amount: number,
        status: "Success" | "Due"
      }
    ]
  },
  date: string
}
```

## Implementation Plan

### Phase 1: Setup and Configuration

#### 1.1 Update App.js Routing
```javascript
// In App.js
{isSubscriberApp ? (
  <SubscriberLayout>
    <Switch>
      <Route path="/customer" component={SubscriberApp} />
      <Route path="/customer/login" component={SubscriberLogin} />
      <Route path="/customer/dashboard" component={SubscriberDashboard} />
      <Route path="/customer/groups" component={SubscriberGroups} />
      <Route path="/customer/groups/:id" component={SubscriberGroupDetails} />
      <Route path="/customer/transactions" component={SubscriberTransactions} />
      <Route path="/customer/auctions" component={SubscriberAuctions} />
      <Route path="/customer/profile" component={SubscriberProfile} />
    </Switch>
  </SubscriberLayout>
) : (
  <UserLayout>
    <Switch>
      {/* Existing user routes - UNTOUCHED */}
    </Switch>
  </UserLayout>
)}
```

#### 1.2 Create Subscriber API Service
```javascript
// src/utils/subscriber/apiService.js
class SubscriberApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || 'https://mytreasure.in/api/v1';
  }

  // Authentication methods
  async signIn(credentials) { /* ... */ }
  async verifyOTP(data) { /* ... */ }
  async sendOTP(phone) { /* ... */ }
  async forgotPassword(data) { /* ... */ }

  // Dashboard methods
  async getGroupDashboard(progress = 'INPROGRESS') { /* ... */ }
  async getTransactionDashboard(page = 1, size = 10) { /* ... */ }
  async getGroupDetails(groupId, grpSubId) { /* ... */ }

  // Auction methods
  async getAuctionDetails(groupAccountId) { /* ... */ }
  async placeBid(bidData) { /* ... */ }

  // Profile methods
  async getUserProfile() { /* ... */ }
  async updateProfile(data) { /* ... */ }
}
```

### Phase 2: Context and State Management

#### 2.1 Subscriber Context
```javascript
// src/context/subscriber/SubscriberContext.js
const SubscriberContext = createContext();

export const SubscriberProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [groups, setGroups] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Authentication methods
  const signIn = async (credentials) => { /* ... */ };
  const signOut = () => { /* ... */ };

  // Data fetching methods
  const fetchGroupDashboard = async (progress) => { /* ... */ };
  const fetchTransactionDashboard = async (page, size) => { /* ... */ };
  const fetchGroupDetails = async (groupId, grpSubId) => { /* ... */ };

  return (
    <SubscriberContext.Provider value={{
      user, isAuthenticated, groups, transactions, loading,
      signIn, signOut, fetchGroupDashboard, fetchTransactionDashboard, fetchGroupDetails
    }}>
      {children}
    </SubscriberContext.Provider>
  );
};
```

### Phase 3: Component Development

#### 3.1 Layout Components
```javascript
// src/components/subscriber/layout/SubscriberLayout.js
const SubscriberLayout = ({ children }) => {
  return (
    <div className="subscriber-layout">
      <SubscriberHeader />
      <SubscriberSidebar />
      <main className="subscriber-main">
        {children}
      </main>
      <SubscriberFooter />
    </div>
  );
};
```

#### 3.2 Dashboard Components
```javascript
// src/components/subscriber/dashboard/GroupDashboard.js
const GroupDashboard = () => {
  const { groups, fetchGroupDashboard } = useSubscriberContext();
  const [selectedProgress, setSelectedProgress] = useState('INPROGRESS');

  useEffect(() => {
    fetchGroupDashboard(selectedProgress);
  }, [selectedProgress]);

  return (
    <div className="group-dashboard">
      <ProgressFilter 
        selected={selectedProgress} 
        onChange={setSelectedProgress} 
      />
      <GroupStats />
      <GroupList groups={groups} />
    </div>
  );
};
```

#### 3.3 Transaction Components
```javascript
// src/components/subscriber/transactions/TransactionDashboard.js
const TransactionDashboard = () => {
  const { transactions, fetchTransactionDashboard } = useSubscriberContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchTransactionDashboard(currentPage, pageSize);
  }, [currentPage, pageSize]);

  return (
    <div className="transaction-dashboard">
      <TransactionSummary />
      <TransactionList transactions={transactions} />
      <Pagination 
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
```

### Phase 4: Page Components

#### 4.1 Main Subscriber App
```javascript
// src/pages/subscriber/SubscriberApp.js
const SubscriberApp = () => {
  const { isAuthenticated } = useSubscriberContext();

  if (!isAuthenticated) {
    return <Navigate to="/customer/login" />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/customer/dashboard" />} />
      <Route path="/dashboard" element={<SubscriberDashboard />} />
      <Route path="/groups" element={<SubscriberGroups />} />
      <Route path="/groups/:id" element={<SubscriberGroupDetails />} />
      <Route path="/transactions" element={<SubscriberTransactions />} />
      <Route path="/auctions" element={<SubscriberAuctions />} />
      <Route path="/profile" element={<SubscriberProfile />} />
    </Routes>
  );
};
```

#### 4.2 Authentication Pages
```javascript
// src/pages/subscriber/SubscriberLogin.js
const SubscriberLogin = () => {
  const { signIn } = useSubscriberContext();
  const [credentials, setCredentials] = useState({ phone: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn(credentials);
  };

  return (
    <div className="subscriber-login">
      <LoginForm 
        credentials={credentials}
        onChange={setCredentials}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
```

### Phase 5: Styling and UI

#### 5.1 Subscriber-Specific Styles
```css
/* src/styles/subscriber.css */
.subscriber-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.subscriber-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
}

.subscriber-sidebar {
  background: white;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  width: 250px;
}

.subscriber-main {
  flex: 1;
  padding: 2rem;
}

.group-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}
```

## Role-Based Access Control

### Implementation Strategy
```javascript
// src/utils/subscriber/roleUtils.js
export const isSubscriberApp = (user) => {
  // Check if user has subscriber role
  return user?.userAccounts?.some(account => 
    account.accountName === 'Subscriber'
  );
};

// In App.js
const { user } = useUserContext();
const subscriberApp = isSubscriberApp(user);

return (
  <Router>
    {subscriberApp ? (
      <SubscriberLayout>
        <SubscriberRoutes />
      </SubscriberLayout>
    ) : (
      <UserLayout>
        <UserRoutes />
      </UserLayout>
    )}
  </Router>
);
```

## Security Considerations

### 1. Route Protection
- Implement subscriber-specific route guards
- Ensure subscriber routes are only accessible to subscriber users
- Maintain separation between user and subscriber data

### 2. API Security
- Use same JWT authentication system
- Implement subscriber-specific API endpoints
- Ensure data isolation between user and subscriber contexts

### 3. Data Isolation
- Separate subscriber state from user state
- Use different API base URLs if needed
- Implement proper error handling for subscriber-specific errors

## Testing Strategy

### 1. Unit Tests
- Test subscriber-specific components
- Test API service methods
- Test context providers

### 2. Integration Tests
- Test authentication flow
- Test data fetching and state management
- Test routing between subscriber and user apps

### 3. E2E Tests
- Test complete subscriber journey
- Test role-based access control
- Test mobile responsiveness

## Deployment Considerations

### 1. Environment Variables
```javascript
// .env
REACT_APP_API_BASE_URL=https://mytreasure.in/api/v1
REACT_APP_SUBSCRIBER_MODE=true
REACT_APP_WEBSOCKET_URL=wss://mytreasure.in
```

### 2. Build Configuration
- Ensure subscriber components are included in build
- Maintain separate CSS bundles if needed
- Test production build with subscriber functionality

## Timeline and Milestones

### Week 1: Setup and API Integration
- [ ] Update App.js routing
- [ ] Create subscriber API service
- [ ] Set up subscriber context

### Week 2: Core Components
- [ ] Create subscriber layout components
- [ ] Implement dashboard components
- [ ] Build authentication pages

### Week 3: Feature Implementation
- [ ] Implement group management
- [ ] Build transaction dashboard
- [ ] Create auction functionality

### Week 4: Testing and Polish
- [ ] Implement comprehensive testing
- [ ] Add responsive design
- [ ] Performance optimization

## Risk Mitigation

### 1. Existing App Protection
- Never modify existing user components
- Use separate file structure
- Implement feature flags for gradual rollout

### 2. API Compatibility
- Test all API endpoints thoroughly
- Implement fallback mechanisms
- Monitor API response changes

### 3. User Experience
- Maintain consistent design language
- Ensure mobile responsiveness
- Implement proper loading states

This plan ensures a clean separation between the existing user application and the new subscriber application while leveraging the existing infrastructure and maintaining code quality standards.
