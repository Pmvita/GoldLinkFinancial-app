# SecureBank Database

This folder contains JSON files that serve as the database for the SecureBank application.

## File Structure

### users.json
Contains user profiles with authentication details, personal information, and tier classifications.

**User Tiers:**
- **Standard** ($0 - $49,999): Basic banking services
- **Premium** ($50k - $249,999): Enhanced services, no fees
- **Platinum** ($250k - $999,999): Relationship manager, investment advisory
- **Private Banking** ($1M - $9.99M): Wealth management, concierge services
- **Ultra High Net Worth** ($10M+): Dedicated team, family office services

**Demo Users:**
1. **Pierre Mvita** (Ultra High Net Worth)
   - Email: pierre.mvita@privatewealth.com
   - Password: demo123
   - Total Assets: $41M+
   - Tier: Ultra High Net Worth

2. **Sarah Johnson** (Private Banking)
   - Email: sarah.johnson@email.com
   - Password: demo123
   - Total Assets: $1.7M
   - Tier: Private Banking

3. **John Smith** (Platinum)
   - Email: demo@bank.com
   - Password: demo123
   - Total Assets: $909k
   - Tier: Platinum

### accounts.json
Account details including balances, account numbers, routing numbers, and account types.

**Account Types:**
- Checking
- Savings
- Investment
- Money Market

### cards.json
Credit and debit card information including card numbers, limits, rewards, and status.

**Card Types:**
- Credit Cards (with limits and rewards)
- Debit Cards (linked to checking/savings)

### transactions.json
Transaction history for all users including debits, credits, and transfers.

**Transaction Categories:**
- Income, Shopping, Dining, Travel, Utilities, Transfer, Investment, Luxury, etc.

### payees.json
Bill pay recipients with recurring payment schedules.

**Categories:**
- Housing, Utilities, Credit Cards, Health, etc.

### budgets.json
Monthly budgets by category and savings goals for each user.

## Usage

Import these JSON files into your application to populate the banking system with realistic data. All passwords are set to `demo123` for testing purposes.

## Security Note

This is demo data for development purposes only. In production:
- Never store passwords in plain text
- Use encryption for sensitive data
- Implement proper authentication and authorization
- Follow PCI DSS compliance standards
