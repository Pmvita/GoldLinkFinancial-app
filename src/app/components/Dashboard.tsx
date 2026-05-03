import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowUpRight, ArrowDownRight, Eye, EyeOff, Crown, Star, ShieldCheck, ChevronRight } from 'lucide-react';
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

    const fullUser = usersData.users.find(u => u.id === user.id);
    if (fullUser) {
      setUserTier(usersData.tiers[fullUser.tier] || { name: 'Private Client', limits: { dailyTransfer: 1000000 } });
    }
  }, [user]);

  const totalBalance = userAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const balanceData = (() => {
    const grouped = [];
    const seenDates = new Set();
    for (const txn of recentTransactions) {
      const display = new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!seenDates.has(display)) {
        seenDates.add(display);
        grouped.push({
          id: txn.id,
          date: txn.date,
          displayDate: display,
          balance: txn.balance,
        });
      }
    }
    return grouped.slice(0, 6).reverse();
  })();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-white mb-2">Good evening, <span className="font-medium text-[#cca858]">{user?.name?.split(' ')[0] || 'Client'}</span></h1>
            <p className="text-gray-400">Here is your private wealth overview.</p>
          </div>
          {userTier && (
            <div className="inline-flex items-center gap-2 bg-[#cca858]/10 text-[#cca858] px-4 py-2 rounded-full border border-[#cca858]/20">
              <Crown className="h-4 w-4" />
              <span className="text-sm font-medium uppercase tracking-wider">{userTier.name} Status</span>
            </div>
          )}
        </div>

        {/* Total Net Worth Card */}
        <Card className="bg-gradient-to-br from-[#121217] to-[#0a0a0c] border-[#27272a] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#cca858] opacity-5 rounded-full blur-[80px]"></div>
          <CardContent className="p-6 sm:p-8 md:p-12 relative z-10">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <p className="text-gray-400 font-medium uppercase tracking-widest text-xs sm:text-sm">Total Portfolio Value</p>
                  <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-gray-500 hover:text-[#cca858] transition-colors p-2 -ml-2">
                    {balanceVisible ? <EyeOff className="h-5 w-5 sm:h-4 sm:w-4" /> : <Eye className="h-5 w-5 sm:h-4 sm:w-4" />}
                  </button>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight break-all">
                  {balanceVisible ? formatCurrency(totalBalance || 12500450.00) : '••••••••'}
                </h2>
                <div className="flex items-center gap-2 text-sm mt-4">
                  <span className="text-emerald-400 flex items-center bg-emerald-400/10 px-2 py-1 rounded-md">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    +2.4%
                  </span>
                  <span className="text-gray-500">vs last month</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                <Button className="w-full sm:w-auto bg-[#cca858] hover:bg-[#b5954a] text-[#121217] h-14 sm:h-12 px-6 text-base sm:text-sm font-semibold rounded-xl sm:rounded-lg shadow-lg shadow-[#cca858]/20">
                  <ArrowUpRight className="h-5 w-5 sm:h-4 sm:w-4 mr-2" /> Make a Transfer
                </Button>
                <Button variant="outline" className="w-full sm:w-auto h-14 sm:h-12 px-6 rounded-xl sm:rounded-lg border-[#27272a] bg-transparent text-white hover:bg-[#1a1a20] hover:text-[#cca858] text-base sm:text-sm">
                  View Portfolio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart */}
          <Card className="lg:col-span-2 bg-[#121217] border-[#27272a]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-white">Wealth Trajectory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={balanceData.length ? balanceData : [{displayDate:'Jan 1', balance: 12000000}, {displayDate:'Feb 1', balance: 12200000}, {displayDate:'Mar 1', balance: 12500450}]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                    <XAxis 
                      dataKey="displayDate" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#71717a', fontSize: 12}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#71717a', fontSize: 12}}
                      tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#121217', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#cca858' }}
                      formatter={(value) => [formatCurrency(value), 'Balance']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#cca858" 
                      strokeWidth={3}
                      dot={{ fill: '#121217', stroke: '#cca858', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#cca858' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Dedicated Advisor */}
          <Card className="bg-[#121217] border-[#27272a] flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-[#cca858]" /> Your Private Advisor
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full border-2 border-[#27272a] overflow-hidden">
                  <img src="https://i.pravatar.cc/150?img=32" alt="Advisor" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Eleanor Sterling</h3>
                  <p className="text-sm text-[#cca858]">Senior Wealth Director</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6 flex-1">
                <div className="bg-[#1a1a20] rounded-lg p-4 border border-[#27272a]">
                  <p className="text-sm text-gray-300">"Your quarterly portfolio review is ready. The emerging markets fund has exceeded our expectations by 4.2%."</p>
                  <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                </div>
              </div>
              
              <Button className="w-full bg-[#1a1a20] hover:bg-[#27272a] text-white border border-[#27272a]">
                Schedule Consultation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions & Accounts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Accounts */}
          <Card className="bg-[#121217] border-[#27272a]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-white">Your Accounts</CardTitle>
              <Button variant="ghost" className="text-[#cca858] hover:text-[#e6cc80] hover:bg-[#cca858]/10 text-sm">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {(userAccounts.length ? userAccounts : [
                {id: 1, name: 'Private Checking', number: '•••• 4829', balance: 1250000.50},
                {id: 2, name: 'Global Investment', number: '•••• 9931', balance: 8400000.00},
                {id: 3, name: 'Offshore Trust', number: '•••• 1120', balance: 2850449.50}
              ]).map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 sm:p-5 rounded-xl bg-[#0a0a0c] border border-[#27272a] hover:border-[#cca858]/50 transition-colors cursor-pointer active:bg-[#1a1a20]">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full bg-[#1a1a20] flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-[#cca858]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white font-medium text-sm sm:text-base truncate">{account.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-500">{account.number}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-white font-medium text-sm sm:text-base">{balanceVisible ? formatCurrency(account.balance) : '••••••••'}</p>
                    <p className="text-xs sm:text-sm text-emerald-400">Available</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card className="bg-[#121217] border-[#27272a]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-white">Recent Activity</CardTitle>
              <Button variant="ghost" className="text-[#cca858] hover:text-[#e6cc80] hover:bg-[#cca858]/10 text-sm">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {(recentTransactions.length ? recentTransactions.slice(0, 4) : [
                {id: 1, description: 'Sotheby\'s Auction House', amount: -450000, date: '2026-05-02T14:30:00'},
                {id: 2, description: 'Dividend - Vanguard S&P 500', amount: 125400.50, date: '2026-05-01T09:15:00'},
                {id: 3, description: 'Private Jet Charter Services', amount: -28500, date: '2026-04-28T16:45:00'},
                {id: 4, description: 'Patek Philippe SA', amount: -185000, date: '2026-04-25T11:20:00'}
              ]).map((txn) => (
                <div key={txn.id} className="flex items-center justify-between py-4 border-b border-[#27272a] last:border-0 hover:bg-[#1a1a20]/50 px-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full flex items-center justify-center ${txn.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {txn.amount > 0 ? <ArrowDownRight className="h-5 w-5 sm:h-6 sm:w-6" /> : <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm sm:text-base truncate max-w-[150px] sm:max-w-[250px]">{txn.description}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-medium text-sm sm:text-base ${txn.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                      {txn.amount > 0 ? '+' : ''}{formatCurrency(txn.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </Layout>
  );
}