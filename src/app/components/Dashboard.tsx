import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockAccounts = [
  { id: 1, name: 'Checking Account', type: 'Checking', balance: 12458.32, accountNumber: '****4521' },
  { id: 2, name: 'Savings Account', type: 'Savings', balance: 45230.85, accountNumber: '****7832' },
  { id: 3, name: 'Credit Card', type: 'Credit', balance: -2145.67, accountNumber: '****3421' },
];

const recentTransactions = [
  { id: 1, description: 'Amazon.com', amount: -127.45, date: '2026-05-02', category: 'Shopping' },
  { id: 2, description: 'Salary Deposit', amount: 5200.00, date: '2026-05-01', category: 'Income' },
  { id: 3, description: 'Electric Bill', amount: -145.32, date: '2026-04-30', category: 'Utilities' },
  { id: 4, description: 'Starbucks', amount: -8.50, date: '2026-04-30', category: 'Food' },
  { id: 5, description: 'Gas Station', amount: -62.18, date: '2026-04-29', category: 'Transportation' },
];

const spendingData = [
  { month: 'Dec', amount: 3245 },
  { month: 'Jan', amount: 2890 },
  { month: 'Feb', amount: 3567 },
  { month: 'Mar', amount: 2978 },
  { month: 'Apr', amount: 3421 },
  { month: 'May', amount: 1856 },
];

const balanceData = [
  { date: 'Apr 1', balance: 54200 },
  { date: 'Apr 8', balance: 55800 },
  { date: 'Apr 15', balance: 53600 },
  { date: 'Apr 22', balance: 56100 },
  { date: 'Apr 29', balance: 57200 },
  { date: 'May 3', balance: 55543 },
];

export default function Dashboard({ user, onLogout }) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Welcome back, {user?.name?.split(' ')[0]}</h1>
        </div>

        {/* Total Balance Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">Total Balance</div>
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
              {balanceVisible ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">Quick Transfer</Button>
              <Button variant="secondary" size="sm">Pay Bills</Button>
            </div>
          </CardContent>
        </Card>

        {/* Accounts Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockAccounts.map((account) => (
            <Card key={account.id}>
              <CardContent className="p-6">
                <div className="text-sm text-gray-500 mb-1">{account.type}</div>
                <div className="text-lg font-semibold mb-1">{account.name}</div>
                <div className="text-2xl font-semibold mb-2">
                  ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-500">{account.accountNumber}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Balance Trend</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.amount > 0 ? (
                        <ArrowDownRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-gray-500">{transaction.category} • {transaction.date}</div>
                    </div>
                  </div>
                  <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {transaction.amount > 0 ? '+' : ''} ${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
