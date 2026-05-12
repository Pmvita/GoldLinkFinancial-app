export type UserTier = 'standard' | 'premium' | 'platinum' | 'private' | 'ultra_high_net_worth';

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserNotificationPreferences {
  largePurchases: boolean;
  allPurchases: boolean;
  deposits: boolean;
  lowBalance: boolean;
  billReminders: boolean;
  budgetAlerts: boolean;
  loginAlerts: boolean;
  passwordChanges: boolean;
  suspicious: boolean;
}

export interface UserPreferences {
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  notifications: UserNotificationPreferences;
}

export interface User {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  tier: UserTier;
  tierName: string;
  relationshipManager: string | null;
  relationshipManagerPhone: string | null;
  memberSince: string;
  dateOfBirth: string;
  address: UserAddress;
  preferences: UserPreferences;
  lastLogin: string;
}

export interface TierInfo {
  name: string;
  minBalance: number;
  maxBalance: number | null;
  benefits: string[];
  fees: {
    monthlyMaintenance: number;
    wireTransfer: number;
    overdraft: number;
  };
}

export type AccountType = 'checking' | 'savings' | 'investment' | 'money_market';

export type AccountStatus = 'active' | 'frozen' | 'closed';

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  routingNumber: string;
  type: AccountType;
  name: string;
  balance: number;
  currency: string;
  status: AccountStatus;
  openedDate: string;
  interestRate: number | null;
}

export type TransactionType = 'debit' | 'credit';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  cardId: string | null;
  type: TransactionType;
  category: string;
  merchant: string;
  description: string;
  amount: number;
  balance: number;
  date: string;
  status: TransactionStatus;
  location: string | null;
}

export type CardType = 'credit' | 'debit';
export type CardStatus = 'active' | 'frozen' | 'closed';

export interface Card {
  id: string;
  userId: string;
  accountId: string;
  cardNumber: string;
  lastFour: string;
  type: CardType;
  network: string;
  name: string;
  status: CardStatus;
  expiryDate: string;
  cvv: string;
  creditLimit: number | null;
  balance: number | null;
  availableCredit: number | null;
  rewardsPoints: number | null;
  issuedDate: string;
  billingCycle: number | null;
  nextPaymentDue: string | null;
  minimumPayment: number | null;
}

export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export interface PayeeRecurringPayment {
  enabled: boolean;
  frequency: RecurringFrequency;
  dayOfMonth: number;
  nextDue: string;
}

export interface PayeeLastPayment {
  amount: number;
  date: string;
}

export interface Payee {
  id: string;
  userId: string;
  name: string;
  accountNumber: string;
  category: string;
  defaultAmount: number;
  recurringPayment: PayeeRecurringPayment;
  lastPayment: PayeeLastPayment;
}

export interface BudgetCategory {
  name: string;
  budget: number;
  spent: number;
  color: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
}

export interface Budget {
  userId: string;
  monthlyBudget: number;
  categories: BudgetCategory[];
  savingsGoals: SavingsGoal[];
}
