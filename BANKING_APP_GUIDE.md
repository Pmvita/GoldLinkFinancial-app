# GoldLink Bank - Full-Stack Banking Application

## 🏦 Overview

**GoldLink Bank** is a comprehensive private wealth and banking platform featuring multi-tier customer segmentation from standard retail banking to ultra-high-net-worth family office services.

---

## 🚀 Quick Start

### Demo Login Credentials

**Admin Account (Ultra High Net Worth)**
```
Username: pmvita
Password: admin123
```

**Additional Demo Accounts**
```
Sarah Johnson (Private Banking)
Username: sarah.johnson@email.com
Password: demo123

John Smith (Platinum)
Username: demo@bank.com
Password: demo123
```

---

## 💎 User Tiers

### 1. Ultra High Net Worth (UHNWI) 👑
**Balance Required:** $10,000,000+

**Pierre Mvita's Portfolio:**
- Private Wealth Checking: $2,847,563.42
- High-Yield Savings: $8,456,982.18
- Portfolio Investment: $24,567,890.55
- Money Market: $5,234,567.89
- **Total Assets: $41,107,004.04**

**Exclusive Benefits:**
- Dedicated wealth management team (3-5 specialists)
- Family office services
- Global investment access (hedge funds, private equity)
- Art and collectibles financing
- Yacht and aircraft financing
- Multi-generational wealth planning
- Philanthropic foundation support
- Custom banking solutions
- Private jet partnerships
- Real estate investment advisory

**Relationship Manager:** Victoria Sterling  
**Member Since:** March 15, 2018

---

### 2. Private Banking 💼
**Balance Required:** $1,000,000 - $9,999,999

**Sarah Johnson's Portfolio:**
- Private Banking Checking: $456,789.32
- Private Savings: $1,234,567.85
- **Total Assets: $1,691,357.17**

**Benefits:**
- Private wealth management team
- White-glove concierge services
- Exclusive investment opportunities
- Trust and estate planning
- Tax optimization strategies
- Priority 24/7 customer service

**Relationship Manager:** Michael Chen

---

### 3. Platinum 🥇
**Balance Required:** $250,000 - $999,999

**John Smith's Portfolio:**
- Platinum Checking: $342,458.32
- Platinum Savings: $567,230.85
- **Total Assets: $909,689.17**

**Benefits:**
- Dedicated relationship manager
- Free international wire transfers
- Investment advisory services
- Travel insurance
- Airport lounge access
- Exclusive rates on loans

---

## 🎯 Core Features

### 1. Authentication & Security
- ✅ Multi-factor authentication (2FA)
- ✅ Biometric login simulation
- ✅ OTP verification
- ✅ Session management
- ✅ Device registration
- ✅ Automatic timeouts

### 2. Dashboard
- ✅ Portfolio overview with total balance
- ✅ Multiple account summaries
- ✅ Balance trend charts
- ✅ Spending analytics
- ✅ Recent transactions
- ✅ Tier-specific benefits display

### 3. Account Management
- ✅ Multiple account types (Checking, Savings, Investment, Money Market)
- ✅ Detailed transaction history
- ✅ Search and filter transactions
- ✅ Account statements
- ✅ Interest rate displays

### 4. Money Transfers
- ✅ Internal transfers between accounts
- ✅ P2P transfers (email/phone)
- ✅ Wire transfers (domestic & international)
- ✅ Recent recipients
- ✅ Transfer scheduling

### 5. Bill Pay
- ✅ Payee management
- ✅ Recurring payments (weekly, monthly, quarterly)
- ✅ Payment scheduling
- ✅ Due date tracking
- ✅ Payment history

### 6. Mobile Check Deposit
- ✅ Photo upload simulation
- ✅ Front and back check capture
- ✅ OCR processing progress
- ✅ Deposit history
- ✅ Availability timeline

### 7. Card Management
- ✅ Credit and debit card overview
- ✅ Card freeze/unfreeze
- ✅ PIN change
- ✅ Lost/stolen reporting
- ✅ Rewards points tracking
- ✅ Credit limit and available credit

### 8. Budgeting & Goals
- ✅ Category-based budgeting
- ✅ Spending visualization (pie & bar charts)
- ✅ Savings goals tracking
- ✅ Progress indicators
- ✅ Over-budget alerts

### 9. Settings
- ✅ Profile management
- ✅ Password change
- ✅ 2FA configuration
- ✅ Biometric settings
- ✅ Notification preferences
- ✅ Active session management
- ✅ Privacy controls

---

## 📊 Database Structure

### Files Located in `/db/`

1. **users.json** - User profiles, authentication, tier classification
2. **accounts.json** - Bank accounts, balances, interest rates
3. **cards.json** - Credit/debit cards, limits, rewards
4. **transactions.json** - Complete transaction history
5. **payees.json** - Bill pay recipients, recurring schedules
6. **budgets.json** - Budget categories, savings goals

### Data Relationships

```
users.json (id: USR-001)
    ↓
    ├─→ accounts.json (userId: USR-001)
    │       ├─→ ACC-001-CHK (Checking)
    │       ├─→ ACC-001-SAV (Savings)
    │       ├─→ ACC-001-INV (Investment)
    │       └─→ ACC-001-MM (Money Market)
    │
    ├─→ cards.json (userId: USR-001)
    │       ├─→ CRD-001-001 (Visa Infinite)
    │       ├─→ CRD-001-002 (Debit)
    │       └─→ CRD-001-003 (Savings Debit)
    │
    ├─→ transactions.json (userId: USR-001)
    ├─→ payees.json (userId: USR-001)
    └─→ budgets.json (userId: USR-001)
```

---

## 🎨 Branding & Design

### Color Scheme

**Primary Colors:**
- Primary Blue: `#2563eb` (from-blue-600)
- Secondary Indigo: `#4f46e5` (to-indigo-700)

**Tier Colors:**
- Ultra High Net Worth: Gradient amber/gold `from-amber-400 to-yellow-500`
- Private Banking: Gradient purple `from-purple-600 to-indigo-600`
- Platinum: Gradient gray `from-gray-400 to-gray-500`

**Status Colors:**
- Success/Credit: `text-green-600`
- Debit/Expense: `text-gray-900`
- Warning: `text-yellow-700`
- Error: `text-red-600`

### Typography
- Headings: Font-semibold
- Body: Default system fonts
- Numbers: Monospace for account/card numbers

---

## 🔒 Security Features (Demo)

**Current Implementation (Development Only):**
- Plain text passwords for easy testing
- No encryption (demo data only)
- Session storage in localStorage
- All data is client-side

**Production Requirements:**
⚠️ Before deploying to production, you MUST implement:

1. **Authentication**
   - Bcrypt password hashing (12+ rounds)
   - JWT or OAuth 2.0 tokens
   - Refresh token rotation
   - Device fingerprinting

2. **Encryption**
   - AES-256 for data at rest
   - TLS 1.3 for data in transit
   - PCI DSS Level 1 compliance
   - Tokenize all card numbers

3. **Compliance**
   - SOC 2 Type II certification
   - GDPR compliance
   - CCPA compliance
   - Regular security audits
   - Penetration testing

---

## 🛠️ Technical Stack

### Frontend
- **React 18.3.1** - UI framework
- **React Router 7.13.0** - Navigation
- **TypeScript** - Type safety
- **Tailwind CSS 4.1.12** - Styling

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **Sonner** - Toast notifications
- **React Hook Form** - Form management

### Database (Demo)
- **JSON files** - Simple file-based storage
- No backend server required
- Client-side data loading

---

## 📱 Responsive Design

The application is fully responsive and optimized for:
- ✅ Desktop (1920px+)
- ✅ Laptop (1280px - 1920px)
- ✅ Tablet (768px - 1280px)
- ✅ Mobile (320px - 768px)

**Mobile Features:**
- Hamburger menu navigation
- Touch-friendly buttons
- Optimized card layouts
- Responsive charts

---

## 🎯 User Experience Highlights

### UHNWI Experience (Pierre Mvita)
When logged in as `pmvita`:

1. **Golden Tier Badge** - Crown icon with "Ultra High Net Worth" label
2. **Relationship Manager Info** - Victoria Sterling contact displayed
3. **Premium Benefits Card** - Exclusive benefits showcase on dashboard
4. **High-Value Transactions** - Luxury purchases (Tiffany, Four Seasons)
5. **Multiple Account Types** - Investment and Money Market accounts
6. **Visa Infinite Card** - $500k credit limit with 156k rewards points
7. **White-Glove Messaging** - "Contact Team" quick action button

### Navigation
- **Persistent Sidebar** - Desktop navigation always visible
- **Mobile Menu** - Slide-out drawer for mobile devices
- **Quick Actions** - One-click transfers and bill pay
- **Search Functionality** - Transaction search across all pages

---

## 📈 Key Metrics (Pierre Mvita Account)

**Portfolio Composition:**
- Checking: 7% ($2.85M)
- Savings: 21% ($8.46M)
- Investment: 60% ($24.57M)
- Money Market: 12% ($5.23M)

**Transaction Volume:**
- Largest Single Transaction: $500,000 (Investment Transfer)
- Average Transaction: ~$50,000
- Monthly Interest Income: ~$30,000
- Credit Card Spending: $87,543.28 current balance

**Credit Profile:**
- Total Credit Limit: $500,000
- Available Credit: $412,456.72
- Rewards Points: 156,789 points
- Payment History: Excellent

---

## 🚦 Getting Started - Development

### Prerequisites
- Node.js 18+
- pnpm package manager

### Installation
```bash
# Install dependencies
pnpm install

# Start development server
# Note: Server is already running in Figma Make environment
```

### Login Flow
1. Navigate to `/login`
2. Enter credentials (pmvita / admin123)
3. Complete 2FA verification (any 6-digit code)
4. Redirected to dashboard

### Testing Different Users
- **UHNWI:** pmvita / admin123
- **Private:** sarah.johnson@email.com / demo123
- **Platinum:** demo@bank.com / demo123

---

## 📝 Feature Roadmap

### Phase 1 (Current - MVP) ✅
- Login & Authentication
- Account Viewing
- Basic Transfers
- Transaction History

### Phase 2 (Enhanced Features) ✅
- Bill Pay
- Mobile Deposit
- Card Management
- Budgeting Tools

### Phase 3 (Future)
- [ ] Real backend API integration
- [ ] Mobile native apps (iOS/Android)
- [ ] Advanced analytics
- [ ] Investment portfolio tracking
- [ ] Real-time notifications
- [ ] Document vault
- [ ] Video banking consultations
- [ ] Cryptocurrency integration

---

## 📞 Support & Documentation

**Database Documentation:** See `/db/README.md` for complete database schema

**Component Structure:**
```
src/app/
├── App.tsx                 # Main app with routing
├── components/
│   ├── LoginPage.tsx       # Authentication
│   ├── Dashboard.tsx       # Main dashboard
│   ├── Layout.tsx          # App layout wrapper
│   ├── Accounts.tsx        # Account management
│   ├── Transfers.tsx       # Money transfers
│   ├── BillPay.tsx         # Bill payments
│   ├── MobileDeposit.tsx   # Check deposit
│   ├── Cards.tsx           # Card management
│   ├── Budgeting.tsx       # Budget & goals
│   └── Settings.tsx        # User settings
```

---

## 🏆 Excellence Standards

**GoldLink Bank** represents:
- ✅ Modern wealth management UX
- ✅ Tier-based service differentiation
- ✅ Comprehensive financial tools
- ✅ Security-first design
- ✅ Responsive across all devices
- ✅ Accessible UI components
- ✅ Real-world banking workflows

---

## 📄 License & Usage

This is a demonstration application showcasing a full-stack banking platform. All data is fictional and for development/testing purposes only.

**Demo Data:**
- All users are fictional
- All transactions are simulated
- All account numbers are randomly generated
- Passwords are intentionally simple for demo purposes

---

<div align="center">

**GoldLink Bank**  
*Exceptional Banking for Exceptional People*

© 2026 GoldLink Bank. All rights reserved.

</div>
