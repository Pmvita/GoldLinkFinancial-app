import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowUpRight, ArrowDownRight, Download, Filter, Search } from 'lucide-react';
import { Input } from './ui/input';
import { useState } from 'react';

const accounts = [
  {
    id: 1,
    name: 'Checking Account',
    type: 'Checking',
    balance: 12458.32,
    accountNumber: '****4521',
    routingNumber: '021000021',
    transactions: [
      { id: 1, date: '2026-05-02', description: 'Amazon.com', amount: -127.45, balance: 12458.32 },
      { id: 2, date: '2026-05-01', description: 'Salary Deposit', amount: 5200.00, balance: 12585.77 },
      { id: 3, date: '2026-04-30', description: 'Electric Bill', amount: -145.32, balance: 7385.77 },
      { id: 4, date: '2026-04-30', description: 'Starbucks', amount: -8.50, balance: 7531.09 },
      { id: 5, date: '2026-04-29', description: 'Gas Station', amount: -62.18, balance: 7539.59 },
      { id: 6, date: '2026-04-28', description: 'Transfer to Savings', amount: -1000.00, balance: 7601.77 },
      { id: 7, date: '2026-04-27', description: 'Grocery Store', amount: -156.42, balance: 8601.77 },
      { id: 8, date: '2026-04-26', description: 'Netflix', amount: -15.99, balance: 8758.19 },
    ],
  },
  {
    id: 2,
    name: 'Savings Account',
    type: 'Savings',
    balance: 45230.85,
    accountNumber: '****7832',
    routingNumber: '021000021',
    interestRate: 2.5,
    transactions: [
      { id: 1, date: '2026-05-01', description: 'Interest Payment', amount: 94.23, balance: 45230.85 },
      { id: 2, date: '2026-04-28', description: 'Transfer from Checking', amount: 1000.00, balance: 45136.62 },
      { id: 3, date: '2026-04-15', description: 'Transfer from Checking', amount: 500.00, balance: 44136.62 },
      { id: 4, date: '2026-04-01', description: 'Interest Payment', amount: 91.12, balance: 43636.62 },
    ],
  },
  {
    id: 3,
    name: 'Credit Card',
    type: 'Credit',
    balance: -2145.67,
    accountNumber: '****3421',
    creditLimit: 10000,
    availableCredit: 7854.33,
    dueDate: '2026-05-20',
    minPayment: 50.00,
    transactions: [
      { id: 1, date: '2026-05-02', description: 'Restaurant', amount: -85.40, balance: -2145.67 },
      { id: 2, date: '2026-05-01', description: 'Online Shopping', amount: -245.99, balance: -2060.27 },
      { id: 3, date: '2026-04-30', description: 'Gas Station', amount: -55.00, balance: -1814.28 },
      { id: 4, date: '2026-04-29', description: 'Pharmacy', amount: -32.15, balance: -1759.28 },
      { id: 5, date: '2026-04-25', description: 'Payment - Thank You', amount: 500.00, balance: -1727.13 },
    ],
  },
];

export default function Accounts({ user, onLogout }) {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = selectedAccount.transactions.filter(t =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Accounts</h1>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Statements
          </Button>
        </div>

        <Tabs defaultValue={String(accounts[0].id)} onValueChange={(value) => {
          const account = accounts.find(a => a.id === Number(value));
          if (account) setSelectedAccount(account);
        }}>
          <TabsList className="grid w-full grid-cols-3">
            {accounts.map((account) => (
              <TabsTrigger key={account.id} value={String(account.id)}>
                {account.type}
              </TabsTrigger>
            ))}
          </TabsList>

          {accounts.map((account) => (
            <TabsContent key={account.id} value={String(account.id)} className="space-y-6">
              {/* Account Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Current Balance</div>
                      <div className="text-3xl font-semibold">
                        ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Account Number</div>
                      <div className="text-lg">{account.accountNumber}</div>
                      {account.routingNumber && (
                        <>
                          <div className="text-sm text-gray-500 mt-2">Routing Number</div>
                          <div className="text-sm">{account.routingNumber}</div>
                        </>
                      )}
                    </div>
                    {account.interestRate && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Interest Rate</div>
                        <div className="text-lg font-semibold">{account.interestRate}% APY</div>
                      </div>
                    )}
                    {account.creditLimit && (
                      <>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Credit Limit</div>
                          <div className="text-lg">${account.creditLimit.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Available Credit</div>
                          <div className="text-lg font-semibold text-green-600">
                            ${account.availableCredit.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Payment Due</div>
                          <div className="text-lg">{account.dueDate}</div>
                          <div className="text-sm text-gray-500">Min: ${account.minPayment}</div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Transaction History */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Transaction History</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search transactions..."
                          className="pl-9 w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-4">
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
                            <div className="text-sm text-gray-500">{transaction.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Balance: ${transaction.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
}
