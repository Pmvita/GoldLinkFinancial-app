import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { ShieldCheck, Plus, ArrowUpRight, ArrowDownRight, CreditCard, Landmark, LineChart, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import accountsData from '../../../db/accounts.json';
import transactionsData from '../../../db/transactions.json';

export default function Accounts({ user, onLogout }) {
  const [userAccounts, setUserAccounts] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);

  useEffect(() => {
    const accounts = accountsData.accounts.filter(acc => acc.userId === user.id) || [
      {id: '1', type: 'checking', name: 'Private Checking', number: '•••• 4829', balance: 1250000.50},
      {id: '2', type: 'investment', name: 'Global Investment', number: '•••• 9931', balance: 8400000.00},
      {id: '3', type: 'trust', name: 'Offshore Trust', number: '•••• 1120', balance: 2850449.50}
    ];
    setUserAccounts(accounts);

    const accountIds = accounts.map(acc => acc.id);
    const txns = transactionsData.transactions?.filter(txn => accountIds.includes(txn.accountId)) || [];
    setUserTransactions(txns);
  }, [user]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case 'checking': return <CreditCard className="h-6 w-6 text-[#cca858]" />;
      case 'savings': return <Landmark className="h-6 w-6 text-[#cca858]" />;
      case 'investment': return <LineChart className="h-6 w-6 text-[#cca858]" />;
      default: return <ShieldCheck className="h-6 w-6 text-[#cca858]" />;
    }
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-white mb-2">Accounts Portfolio</h1>
            <p className="text-gray-400">Manage and monitor your private wealth accounts.</p>
          </div>
          <Button className="bg-[#cca858] hover:bg-[#b5954a] text-[#121217] shadow-lg shadow-[#cca858]/20 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Open New Account
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {userAccounts.map((account) => (
              <Card key={account.id} className="bg-[#121217] border-[#27272a] hover:border-[#cca858]/50 transition-all overflow-hidden group">
                <CardContent className="p-0">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#27272a]">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-[#0a0a0c] border border-[#27272a] flex items-center justify-center group-hover:border-[#cca858]/30 transition-colors">
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <h2 className="text-xl font-medium text-white">{account.name}</h2>
                        <p className="text-gray-400 font-mono text-sm mt-1">{account.number}</p>
                      </div>
                    </div>
                    <div className="md:text-right">
                      <p className="text-3xl font-light text-white">{formatCurrency(account.balance)}</p>
                      <p className="text-sm text-emerald-400 mt-1">Available Balance</p>
                    </div>
                  </div>
                  <div className="bg-[#0a0a0c] px-6 py-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-[#1a1a20] h-9 px-3 text-sm">
                        <ArrowUpRight className="h-4 w-4 mr-2" /> Transfer
                      </Button>
                      <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-[#1a1a20] h-9 px-3 text-sm">
                        Statements
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card className="bg-[#121217] border-[#27272a] sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Recent Transactions</CardTitle>
                <CardDescription className="text-gray-400">Across all accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {(userTransactions.length ? userTransactions.slice(0, 10) : [
                  {id: 1, description: 'Sotheby\'s Auction House', amount: -450000, date: '2026-05-02T14:30:00'},
                  {id: 2, description: 'Dividend - Vanguard S&P 500', amount: 125400.50, date: '2026-05-01T09:15:00'},
                  {id: 3, description: 'Private Jet Charter Services', amount: -28500, date: '2026-04-28T16:45:00'},
                  {id: 4, description: 'Patek Philippe SA', amount: -185000, date: '2026-04-25T11:20:00'},
                  {id: 5, description: 'Wire Transfer - Cayman Islands', amount: -1500000, date: '2026-04-20T10:00:00'}
                ]).map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1a1a20] transition-colors cursor-pointer border border-transparent hover:border-[#27272a]">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${txn.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {txn.amount > 0 ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm truncate max-w-[120px]">{txn.description}</p>
                        <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right whitespace-nowrap ml-2">
                      <p className={`font-medium text-sm ${txn.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                        {txn.amount > 0 ? '+' : ''}{formatCurrency(txn.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}