import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowUpRight, ArrowDownRight, Eye, EyeOff, Crown, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import accountsData from '../../../db/accounts.json';
import transactionsData from '../../../db/transactions.json';
import usersData from '../../../db/users.json';

export default function Dashboard({ user, onLogout }) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [userAccounts, setUserAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [userTier, setUserTier] = useState(null);

  useEffect(() => {
    // Load user-specific data
    const accounts = accountsData.accounts.filter(acc => acc.userId === user.id);
    setUserAccounts(accounts);

    const accountIds = accounts.map(acc => acc.id);
    const transactions = transactionsData.transactions
      .filter(txn => accountIds.includes(txn.accountId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
    setRecentTransactions(transactions);

    // Get user tier info
    const fullUser = usersData.users.find(u => u.id === user.id);
    if (fullUser) {
      setUserTier(usersData.tiers[fullUser.tier]);
    }
  }, [user]);

  const totalBalance = userAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Generate balance trend data from recent transactions
  const balanceData = recentTransactions
    .slice(0, 6)
    .reverse()
    .map((txn, index) => ({
      date: new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: txn.balance,
    }));

  // Generate spending data from transactions
  const spendingByCategory = {};
  recentTransactions.forEach(txn => {
    if (txn.amount < 0) {
      spendingByCategory[txn.category] = (spendingByCategory[txn.category] || 0) + Math.abs(txn.amount);
    }
  });
  const spendingData = Object.entries(spendingByCategory)
    .map(([category, amount]) => ({ category, amount }))
    .slice(0, 6);

  const getTierBadge = () => {
    if (user.tier === 'ultra_high_net_worth') {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-full text-sm font-semibold">
          <Crown className="h-4 w-4" />
          Ultra High Net Worth
        </div>
      );
    } else if (user.tier === 'private') {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm font-semibold">
          <Star className="h-4 w-4" />
          Private Banking
        </div>
      );
    } else if (user.tier === 'platinum') {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full text-sm font-semibold">
          <Star className="h-4 w-4" />
          Platinum
        </div>
      );
    }
    return null;
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Welcome back, {user.firstName}</h1>
            {user.relationshipManager && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                Your Relationship Manager: <span className="font-medium text-gray-700">{user.relationshipManager}</span>
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            {getTierBadge()}
          </div>
        </div>

        {/* Total Balance Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">Total Portfolio Value</div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setBalanceVisible(!balanceVisible)}
              >
                {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-4xl font-semibold mb-4">
              {balanceVisible ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="secondary" size="sm" className="flex-1 sm:flex-none">Quick Transfer</Button>
              <Button variant="secondary" size="sm" className="flex-1 sm:flex-none">Pay Bills</Button>
              {user.tier === 'ultra_high_net_worth' && (
                <Button variant="secondary" size="sm" className="flex-1 sm:flex-none">Contact Team</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Accounts Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userAccounts.map((account) => (
            <Card key={account.id}>
              <CardContent className="p-6">
                <div className="text-sm text-gray-500 mb-1 capitalize truncate">{account.type.replace('_', ' ')}</div>
                <div className="text-lg font-semibold mb-1 truncate">{account.name}</div>
                <div className="text-2xl font-bold text-gray-900 mb-2 truncate">
                  ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">••••{account.accountNumber.slice(-4)}</div>
                  {account.interestRate && (
                    <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{account.interestRate}% APY</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        {balanceData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Balance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={balanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="balance" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {spendingData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={spendingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Bar dataKey="amount" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.amount > 0 ? (
                        <ArrowDownRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">{transaction.description}</div>
                      <div className="text-sm text-gray-500 capitalize truncate">
                        {transaction.category.replace('_', ' ')} • {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className={`font-semibold ml-4 flex-shrink-0 whitespace-nowrap ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {transaction.amount > 0 ? '+' : ''} ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tier Benefits - Show for UHNWI */}
        {user.tier === 'ultra_high_net_worth' && userTier && (
          <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-amber-600" />
                <CardTitle>Your Ultra High Net Worth Benefits</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userTier.benefits.slice(0, 8).map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
