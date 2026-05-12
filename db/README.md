# GoldLink Bank - Database Documentation

<div align="center">

**🏦 GoldLink Bank**  
*Where Wealth Meets Innovation*

A comprehensive private wealth and banking platform designed for high-net-worth individuals and families.

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Database Architecture](#database-architecture)
- [User Tiers & Benefits](#user-tiers--benefits)
- [Demo Accounts](#demo-accounts)
- [File Specifications](#file-specifications)
- [Data Relationships](#data-relationships)
- [Security Considerations](#security-considerations)

---

## 🎯 Overview

The GoldLink Bank database consists of six JSON files that power a full-featured private banking application. This database supports multi-tier wealth management, featuring everything from standard retail banking to ultra-high-net-worth family office services.

The same files are consumed by both apps in the monorepo:

- **`apps/web`** imports the JSON files directly (e.g. `import accountsData from '../../../../../db/accounts.json'`) and filters by `userId` in component-level effects.
- **`apps/mobile`** reads through the typed accessors in [`@goldlink/core`](../packages/core/README.md) (`getAccountsForUser`, `getCardsForUser`, etc.), which in turn import these JSON files.

Note: `payees.json` is currently used in two places — Bill Pay (as expected) **and** the web Transfers screen, where it doubles as the saved-recipient list for wires. That overlap is tracked as a follow-up; a real backend would split payees from transfer counterparties.

**Key Features:**
- ✅ Multi-tier customer segmentation (5 wealth tiers)
- ✅ Comprehensive account management (Checking, Savings, Investment, Money Market)
- ✅ Credit and debit card systems with rewards programs
- ✅ Transaction history with detailed categorization
- ✅ Bill pay with recurring payment automation
- ✅ Budget tracking and savings goal management
- ✅ Private wealth and relationship banking services

---

## 🏗️ Database Architecture

```
db/
├── users.json          # User profiles, authentication, tier classification
├── accounts.json       # Bank accounts, balances, interest rates
├── cards.json          # Credit/debit cards, limits, rewards
├── transactions.json   # Complete transaction history
├── payees.json        # Bill pay recipients, recurring schedules
└── budgets.json       # Budget categories, savings goals
```

**Total Records:**
- 3 Users across 3 different wealth tiers
- 8 Bank Accounts (Checking, Savings, Investment, Money Market)
- 7 Cards (Credit and Debit with various networks)
- 15+ Transactions with full categorization
- 9 Bill Pay Payees with recurring schedules
- 3 Complete budget profiles with savings goals

---

## 💎 User Tiers & Benefits

GoldLink Bank offers five distinct service tiers based on total relationship balance:

### 🥉 Standard Banking
**Balance Required:** $0 - $49,999

**Benefits:**
- Free checking account
- Online and mobile banking
- Debit card with ATM access
- Standard customer service

**Fees:**
- Monthly Maintenance: $12
- Wire Transfer: $25
- Overdraft: $35

---

### 🥈 Premium Banking
**Balance Required:** $50,000 - $249,999

**Benefits:**
- All Standard benefits
- **No monthly maintenance fees**
- Free domestic wire transfers
- Premium customer service line
- Rewards credit card with 1.5% cashback
- Extended hours support

**Fees:**
- Monthly Maintenance: **$0**
- Wire Transfer: **$0** (domestic)
- Overdraft: **$0**

---

### 🥇 Platinum Banking
**Balance Required:** $250,000 - $999,999

**Benefits:**
- All Premium benefits
- **Dedicated relationship manager**
- Free international wire transfers
- Investment advisory services
- Travel insurance and assistance
- Airport lounge access (Priority Pass)
- Exclusive rates on loans and mortgages
- Concierge booking services

**Fees:** None

---

### 💼 Private Banking
**Balance Required:** $1,000,000 - $9,999,999

**Benefits:**
- All Platinum benefits
- **Private wealth management team**
- White-glove concierge services
- Exclusive investment opportunities
- Trust and estate planning
- Tax optimization strategies
- Priority 24/7 customer service
- Invitations to exclusive events
- Art and collectibles advisory
- Multi-currency accounts

**Fees:** None

**Dedicated Services:**
- Quarterly portfolio reviews
- Custom lending solutions
- Family wealth planning
- Philanthropic advisory

---

### 👑 Ultra High Net Worth (UHNWI)
**Balance Required:** $10,000,000+

**Benefits:**
- All Private Banking benefits
- **Dedicated wealth management team** (3-5 specialists)
- **Family office services**
- Global investment access (hedge funds, private equity)
- Art and collectibles financing
- Yacht and aircraft financing
- Multi-generational wealth planning
- Philanthropic foundation support
- Custom banking solutions and structures
- Private jet partnerships
- Real estate investment advisory
- Legacy and succession planning

**Fees:** None

**White-Glove Services:**
- Personal CFO services available
- Direct lines to C-suite executives
- Bespoke financial products
- International tax and legal coordination
- Alternative investment access (venture capital, real estate funds)

---

## 👥 Demo Accounts

### 🌟 Admin Account - Pierre Mvita (UHNWI)

```json
Username: pmvita
Password: admin123
Tier: Ultra High Net Worth
```

**Profile:**
- **Full Name:** Pierre Mvita
- **Email:** pierre.mvita@privatewealth.com
- **Phone:** +1 (212) 555-0001
- **Address:** 432 Park Avenue, Penthouse 92A, New York, NY 10022
- **Member Since:** March 15, 2018
- **Relationship Manager:** Victoria Sterling

**Portfolio Overview:**
| Account Type | Balance | Interest Rate |
|-------------|---------|---------------|
| Private Wealth Checking | $2,847,563.42 | 1.75% APY |
| High-Yield Savings | $8,456,982.18 | 4.25% APY |
| Portfolio Investment | $24,567,890.55 | Market Rate |
| Money Market | $5,234,567.89 | 3.85% APY |
| **TOTAL ASSETS** | **$41,107,004.04** | — |

**Cards:**
- Visa Infinite Credit ($500k limit, 156,789 rewards points)
- Private Wealth Debit Card
- Savings Account Debit Card (frozen)

**Recent Notable Transactions:**
- Tiffany & Co: -$45,678.99
- Quarterly Dividend: +$125,000.00
- Four Seasons Bora Bora: -$28,500.00
- Investment Transfer: -$500,000.00

---

### 💼 Sarah Johnson (Private Banking)

```json
Username: sarah.johnson@email.com
Password: demo123
Tier: Private Banking
```

**Portfolio:** $1,691,357.17 total
- Private Banking Checking: $456,789.32
- Private Savings: $1,234,567.85

**Cards:**
- Mastercard World Elite ($150k limit)
- Private Banking Debit

---

### 🥇 John Smith (Platinum)

```json
Username: demo@bank.com
Password: demo123
Tier: Platinum
```

**Portfolio:** $909,689.17 total
- Platinum Checking: $342,458.32
- Platinum Savings: $567,230.85

**Cards:**
- Visa Signature ($50k limit)
- Platinum Checking Debit

---

## 📄 File Specifications

### 1️⃣ users.json

**Purpose:** Core user authentication and profile data

**Key Fields:**
```javascript
{
  "id": "USR-001",                    // Unique user identifier
  "username": "pmvita",               // Login username
  "password": "admin123",             // Authentication (plain text for demo)
  "firstName": "Pierre",
  "lastName": "Mvita",
  "email": "pierre.mvita@privatewealth.com",
  "phone": "+1 (212) 555-0001",
  "tier": "ultra_high_net_worth",     // Tier classification
  "tierName": "Ultra High Net Worth", // Display name
  "relationshipManager": "Victoria Sterling", // Assigned RM
  "memberSince": "2018-03-15",
  "address": { ... },                 // Full address object
  "preferences": { ... },             // Notification & security settings
  "lastLogin": "2026-05-03T08:15:00Z"
}
```

**Special Sections:**
- `tiers`: Complete tier definitions with benefits and fee structures
- `preferences.notifications`: Granular alert settings
- `preferences.biometricEnabled`: Biometric auth status
- `preferences.twoFactorEnabled`: 2FA status

---

### 2️⃣ accounts.json

**Purpose:** Bank account details and balances

**Account Types:**
- `checking`: Primary transaction account
- `savings`: Interest-bearing savings
- `investment`: Portfolio investment account
- `money_market`: High-yield money market

**Key Fields:**
```javascript
{
  "id": "ACC-001-CHK",
  "userId": "USR-001",               // Links to users.json
  "accountNumber": "8934567821",     // 10-digit account number
  "routingNumber": "021000021",      // ABA routing number
  "type": "checking",
  "name": "Private Wealth Checking",
  "balance": 2847563.42,             // Current balance
  "currency": "USD",
  "status": "active",
  "openedDate": "2018-03-15",
  "interestRate": 1.75               // APY percentage
}
```

---

### 3️⃣ cards.json

**Purpose:** Credit and debit card management

**Card Types:**
- `credit`: Credit cards with limits and rewards
- `debit`: Debit cards linked to accounts

**Card Networks:**
- Visa (Infinite, Signature, Standard)
- Mastercard (World Elite)

**Key Fields:**
```javascript
{
  "id": "CRD-001-001",
  "userId": "USR-001",
  "accountId": "ACC-001-CHK",        // Linked account
  "cardNumber": "5234567890123456",  // Full 16-digit number
  "lastFour": "3456",                // Last 4 digits
  "type": "credit",
  "network": "Visa Infinite",
  "expiryDate": "08/29",
  "cvv": "847",
  "creditLimit": 500000,             // Credit cards only
  "balance": 87543.28,               // Current balance owed
  "availableCredit": 412456.72,
  "rewardsPoints": 156789,           // Accumulated points
  "status": "active",                // active | frozen
  "nextPaymentDue": "2026-05-20",
  "minimumPayment": 2000.00
}
```

---

### 4️⃣ transactions.json

**Purpose:** Complete transaction history

**Transaction Types:**
- `debit`: Money out
- `credit`: Money in

**Categories:**
- Income, Shopping, Dining, Travel, Utilities, Transfer, Investment, Luxury, Food, Housing, etc.

**Key Fields:**
```javascript
{
  "id": "TXN-001-0001",
  "userId": "USR-001",
  "accountId": "ACC-001-CHK",
  "cardId": "CRD-001-001",           // null if not card transaction
  "type": "debit",
  "category": "luxury",
  "merchant": "Tiffany & Co",
  "description": "Tiffany & Co - New York",
  "amount": -45678.99,               // Negative for debits
  "balance": 2847563.42,             // Balance after transaction
  "date": "2026-05-02T14:23:00Z",    // ISO 8601 timestamp
  "status": "completed",
  "location": "New York, NY"
}
```

---

### 5️⃣ payees.json

**Purpose:** Bill pay recipients and schedules

**Categories:**
- Housing, Utilities, Credit Cards, Health, etc.

**Key Fields:**
```javascript
{
  "id": "PAY-001-001",
  "userId": "USR-001",
  "name": "Park Avenue Condo Association",
  "accountNumber": "HOA-432-PA-92A",
  "category": "housing",
  "defaultAmount": 8500.00,
  "recurringPayment": {
    "enabled": true,
    "frequency": "monthly",          // monthly | weekly | biweekly | quarterly
    "dayOfMonth": 1,
    "nextDue": "2026-06-01"
  },
  "lastPayment": {
    "amount": 8500.00,
    "date": "2026-05-01"
  }
}
```

---

### 6️⃣ budgets.json

**Purpose:** Budget tracking and savings goals

**Key Fields:**
```javascript
{
  "userId": "USR-001",
  "monthlyBudget": 150000,           // Total monthly budget
  "categories": [
    {
      "name": "Luxury & Shopping",
      "budget": 50000,
      "spent": 48234.99,
      "color": "#3b82f6"             // Chart color
    }
  ],
  "savingsGoals": [
    {
      "id": "GOAL-001-001",
      "name": "Real Estate Investment Fund",
      "target": 5000000,
      "current": 3250000,
      "color": "#3b82f6"
    }
  ]
}
```

---

## 🔗 Data Relationships

```
users.json (id)
    ↓
    ├─→ accounts.json (userId)
    │       ↓
    │       └─→ transactions.json (accountId)
    │
    ├─→ cards.json (userId)
    │       ↓
    │       ├─→ accounts.json (accountId) [linked account]
    │       └─→ transactions.json (cardId)
    │
    ├─→ payees.json (userId)
    │
    └─→ budgets.json (userId)
```

**Relationship Rules:**
1. All data entities link back to `users.json` via `userId`
2. Cards must link to a valid account via `accountId`
3. Transactions reference both accounts and cards (card optional)
4. Multiple accounts and cards can belong to one user
5. Budget categories should align with transaction categories

---

## 🔒 Security Considerations

### ⚠️ DEMO ENVIRONMENT ONLY

This database is designed for **demonstration and development purposes only**. The following security practices are intentionally omitted for ease of testing:

**Current State (Demo):**
- ❌ Plain text passwords
- ❌ No encryption on sensitive data
- ❌ No input validation
- ❌ No rate limiting
- ❌ Full card numbers visible

### ✅ Production Requirements

Before deploying to production, implement:

1. **Authentication & Authorization**
   - Hash passwords with bcrypt (minimum 12 rounds)
   - Implement JWT or OAuth 2.0 tokens
   - Add refresh token rotation
   - Enable session management with timeouts
   - Implement device fingerprinting

2. **Data Encryption**
   - Encrypt PII at rest (AES-256)
   - Use TLS 1.3 for data in transit
   - Tokenize card numbers (PCI DSS Level 1)
   - Encrypt account numbers and SSNs
   - Hash email addresses for privacy

3. **Compliance Standards**
   - PCI DSS Level 1 certification
   - SOC 2 Type II audit
   - GDPR compliance (EU customers)
   - CCPA compliance (California customers)
   - Regular penetration testing
   - Annual security audits

4. **Access Controls**
   - Role-based access control (RBAC)
   - Multi-factor authentication (TOTP, SMS, biometric)
   - IP whitelisting for admin access
   - Anomaly detection and fraud prevention
   - Real-time transaction monitoring

5. **Data Protection**
   - Regular encrypted backups
   - Point-in-time recovery
   - Data retention policies
   - Secure data deletion procedures
   - DLP (Data Loss Prevention) systems

6. **Monitoring & Logging**
   - Comprehensive audit trails
   - SIEM integration
   - Real-time alerting
   - Suspicious activity detection
   - Compliance reporting

---

## 📊 Usage Statistics

**Database Metrics:**
- Total Users: 3
- Total Accounts: 8
- Total Account Value: $43.7M
- Average Account Balance: $5.46M
- Total Cards: 7
- Active Credit Lines: $700k
- Monthly Transaction Volume: ~$2.5M

**Tier Distribution:**
- Ultra High Net Worth: 1 user (33%)
- Private Banking: 1 user (33%)
- Platinum: 1 user (33%)

---

## 🛠️ Integration Guide

There are two supported ways to read this data, depending on which app you're working in.

### Option 1 — typed accessors via `@goldlink/core` (preferred, used by `apps/mobile`)

```ts
import {
  findUserByCredentials,
  getAccountsForUser,
  getTransactionsForAccount,
  getCardsForUser,
} from '@goldlink/core';

const user = findUserByCredentials('pmvita', 'admin123');
if (user) {
  const accounts = getAccountsForUser(user.id);
  const txns = getTransactionsForAccount(accounts[0].id);
  const cards = getCardsForUser(user.id);
}
```

The accessors are fully typed and pre-sort transactions by date. See [`packages/core/README.md`](../packages/core/README.md) for the full API surface.

### Option 2 — direct JSON imports (current `apps/web` pattern)

```ts
import usersData from '@/../../../db/users.json'; // path varies by file depth
import accountsData from '@/../../../db/accounts.json';
import transactionsData from '@/../../../db/transactions.json';

function authenticateUser(username: string, password: string) {
  return (
    usersData.users.find(
      (u) => u.username === username && u.password === password
    ) ?? null
  );
}

function getUserAccounts(userId: string) {
  return accountsData.accounts.filter((acc) => acc.userId === userId);
}

function getAccountTransactions(accountId: string) {
  return transactionsData.transactions.filter(
    (txn) => txn.accountId === accountId
  );
}
```

Web components today use this direct-import pattern. Migrating them onto `@goldlink/core` is a planned refactor.

---

## 📞 Support

For questions about the database structure or GoldLink Bank platform:

- 📧 Email: dev@goldlinkbank.com
- 📚 Documentation: https://docs.goldlinkbank.com
- 💬 Slack: #goldlink-dev

---

<div align="center">

**GoldLink Bank** - *Exceptional Banking for Exceptional People*

© 2026 GoldLink Bank. All rights reserved.

</div>
