import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowUpRight, ArrowDownRight, Download, Filter, Search } from 'lucide-react';
import { Input } from './ui/input';
import { useState, useEffect } from 'react';
import accountsData from '../../../db/accounts.json';
import transactionsData from '../../../db/transactions.json';

export default function Accounts({ user, onLogout }) {
  const [userAccounts, setUserAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const accounts = accountsData.accounts.filter(acc => acc.userId === user.id);
    setUserAccounts(accounts);
    if (accounts.length > 0) {
      setSelectedAccount(accounts[0]);
    }
  }, [user]);

  const getAccountTransactions = (accountId) => {
    return transactionsData.transactions
      .filter(txn => txn.accountId === accountId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredTransactions = selectedAccount
    ? getAccountTransactions(selectedAccount.id).filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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

        {userAccounts.length > 0 ? (
          <Tabs defaultValue={userAccounts[0].id} onValueChange={(value) => {
            const account = userAccounts.find(a => a.id === value);
            if (account) setSelectedAccount(account);
          }}>
            <TabsList className="flex w-full overflow-x-auto overflow-y-hidden border-b pb-0 mb-4 h-auto rounded-none bg-transparent gap-2 justify-start sm:justify-center px-1">
              {userAccounts.map((account) => (
                <TabsTrigger key={account.id} value={account.id} className="whitespace-nowrap rounded-t-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  {account.type.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </TabsTrigger>
              ))}
            </TabsList>

            {userAccounts.map((account) => {
              const transactions = getAccountTransactions(account.id);

              return (
                <TabsContent key={account.id} value={account.id} className="space-y-6">
                  {/* Account Summary */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Current Balance</div>
                          <div className="text-3xl font-semibold">
                            ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Account Number</div>
                          <div className="text-lg">••••{account.accountNumber.slice(-4)}</div>
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
                            <div className="text-lg font-semibold text-green-600">{account.interestRate}% APY</div>
                          </div>
                        )}
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Account Type</div>
                          <div className="text-lg capitalize">{account.type.replace('_', ' ')}</div>
                          <div className="text-sm text-gray-500 mt-2">Opened</div>
                          <div className="text-sm">{new Date(account.openedDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transaction History */}
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle>Transaction History</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search transactions..."
                              className="pl-9 w-full sm:w-64"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <Button variant="outline" size="icon" className="flex-shrink-0">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {filteredTransactions.length > 0 ? (
                        <div className="space-y-2">
                          {filteredTransactions.map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex items-center justify-between py-4 px-2 sm:px-4 hover:bg-gray-50 rounded-lg transition-colors gap-3"
                            >
                              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
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
                              <div className="text-right flex-shrink-0">
                                <div className={`font-semibold whitespace-nowrap ${
                                  transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                                }`}>
                                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="text-sm text-gray-500 whitespace-nowrap">
                                  Balance: ${transaction.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No transactions found
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No accounts found
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
