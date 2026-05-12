import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Download, Filter, Search, MoreHorizontal, PieChart, Shield, TrendingUp } from 'lucide-react';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import accountsData from '../../../../../db/accounts.json';
import transactionsData from '../../../../../db/transactions.json';

export default function AccountDetail({ user, onLogout }) {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Attempt to fetch real account data from db
    const dbAccount = accountsData.accounts?.find(acc => acc.id === accountId);
    
    // Fallback data mapping to match Accounts.tsx fallbacks if DB is missing
    const fallbackAccounts = {
      '1': { id: '1', type: 'checking', name: 'Private Checking', number: '•••• 4829', balance: 1250000.50, routingNumber: '122000661', openedDate: '2023-01-15' },
      '2': { id: '2', type: 'investment', name: 'Global Investment', number: '•••• 9931', balance: 8400000.00, routingNumber: '122000662', openedDate: '2021-08-22' },
      '3': { id: '3', type: 'trust', name: 'Offshore Trust', number: '•••• 1120', balance: 2850449.50, routingNumber: '122000663', openedDate: '2019-11-05' }
    };
    
    // Create a generated account if none of the above match, to ensure it doesn't crash
    const generatedAccount = {
      id: accountId,
      name: `Account ending in ${String(accountId).slice(-4).padStart(4, '0')}`,
      number: `**** **** **** ${String(accountId).slice(-4).padStart(4, '0')}`,
      balance: Math.random() * 5000000 + 500000,
      type: 'checking',
      routingNumber: '122000661',
      openedDate: '2023-01-15'
    };

    const selectedAccount = dbAccount || fallbackAccounts[accountId] || generatedAccount;
    
    // Attempt to fetch transactions from db
    let selectedTransactions = transactionsData.transactions?.filter(txn => txn.accountId === accountId) || [];
    
    // Fallback transactions if none found
    if (selectedTransactions.length === 0) {
      selectedTransactions = [
        { id: 1, description: 'Wire Transfer - Sotheby\'s', amount: -450000, date: '2026-05-02T14:30:00', status: 'completed', type: 'wire' },
        { id: 2, description: 'Dividend - Vanguard S&P 500', amount: 125400.50, date: '2026-05-01T09:15:00', status: 'completed', type: 'deposit' },
        { id: 3, description: 'Private Jet Charter Services', amount: -28500, date: '2026-04-28T16:45:00', status: 'completed', type: 'card' },
        { id: 4, description: 'Patek Philippe SA', amount: -185000, date: '2026-04-25T11:20:00', status: 'completed', type: 'wire' },
        { id: 5, description: 'Deposit - Monthly Distribution', amount: 250000, date: '2026-04-20T10:00:00', status: 'completed', type: 'deposit' }
      ];
    }

    setTimeout(() => {
      setAccount(selectedAccount);
      setTransactions(selectedTransactions);
      setIsLoading(false);
    }, 400);
  }, [accountId]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const filteredTransactions = transactions.filter(txn => 
    txn.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const getQuickActions = (type) => {
    switch(type) {
      case 'investment':
        return [
          { icon: Download, label: 'Statements', desc: 'Download PDFs' },
          { icon: PieChart, label: 'Asset Allocation', desc: 'Portfolio view' },
          { icon: TrendingUp, label: 'Performance', desc: 'Return on investment' },
          { icon: Shield, label: 'Account Settings', desc: 'Trading limits & security' }
        ];
      case 'trust':
        return [
          { icon: Download, label: 'Statements', desc: 'Download PDFs' },
          { icon: PieChart, label: 'Asset Allocation', desc: 'Portfolio view' },
          { icon: Shield, label: 'Beneficiaries', desc: 'Manage trust entities' },
          { icon: Download, label: 'Tax Documents', desc: 'Annual tax reporting' }
        ];
      case 'checking':
      case 'savings':
      default:
        return [
          { icon: Download, label: 'Statements', desc: 'Download PDFs' },
          { icon: TrendingUp, label: 'Insights', desc: 'Spending analysis' },
          { icon: Shield, label: 'Debit Cards', desc: 'Manage physical cards' },
          { icon: Shield, label: 'Account Settings', desc: 'Limits & security' }
        ];
    }
  };

  const renderMetadata = (account) => {
    switch(account.type) {
      case 'investment':
        return (
          <>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">YTD Return</p>
              <p className="text-emerald-400 font-medium">+14.2%</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Margin</p>
              <p className="text-gray-300 font-mono">$0.00</p>
            </div>
          </>
        );
      case 'trust':
        return (
          <>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Tax ID</p>
              <p className="text-gray-300 font-mono">**-***8212</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Trustee</p>
              <p className="text-gray-300">GoldLink Fiduciary Services</p>
            </div>
          </>
        );
      case 'checking':
      case 'savings':
      default:
        return (
          <>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Routing Number</p>
              <p className="text-gray-300 font-mono">{account.routingNumber || '122000661'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">YTD Interest</p>
              <p className="text-emerald-400 font-medium">+$14,250.00</p>
            </div>
          </>
        );
    }
  };

  if (isLoading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cca858]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/accounts')}
              className="text-gray-400 hover:text-white hover:bg-[#1a1a20]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-white mb-1">{account.name}</h1>
              <p className="text-gray-400 font-mono">{account.number}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/transfers')} className="bg-[#cca858] hover:bg-[#b5954a] text-[#121217] shadow-lg shadow-[#cca858]/20">
              <ArrowUpRight className="h-4 w-4 mr-2" /> Transfer Funds
            </Button>
            <Button variant="outline" className="border-[#27272a] text-white hover:bg-[#1a1a20] hover:text-[#cca858]">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Balance Overview Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#121217] border-[#27272a] overflow-hidden relative">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#cca858]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <p className="text-gray-400 text-sm font-medium tracking-wide uppercase mb-2">Available Balance</p>
                  <p className="text-5xl md:text-6xl font-light text-white tracking-tight">{formatCurrency(account.balance)}</p>
                </div>
                
                <div className="flex flex-wrap gap-6 md:gap-12 pb-2">
                  {renderMetadata(account)}
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Status</p>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Shield className="h-3 w-3" />
                      <span className="text-sm">Active & Secure</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getQuickActions(account.type).map((action, i) => (
            <Card key={i} className="bg-[#121217] border-[#27272a] hover:border-[#cca858]/30 transition-colors cursor-pointer group">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-[#1a1a20] flex items-center justify-center group-hover:bg-[#cca858]/10 group-hover:text-[#cca858] transition-colors">
                  <action.icon className="h-5 w-5 text-gray-400 group-hover:text-[#cca858]" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{action.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{action.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Transactions Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#121217] border-[#27272a]">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#27272a]">
              <div>
                <CardTitle className="text-xl font-medium text-white">Transaction History</CardTitle>
                <CardDescription className="text-gray-400">Recent activity for this account</CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search transactions..." 
                    className="pl-9 bg-[#1a1a20] border-[#27272a] text-white w-full md:w-64 focus-visible:ring-[#cca858]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="border-[#27272a] text-gray-300 hover:bg-[#1a1a20] hover:text-white px-3">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-[#27272a] text-gray-300 hover:bg-[#1a1a20] hover:text-white px-3">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#27272a] text-xs uppercase tracking-wider text-gray-500 bg-[#0a0a0c]">
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Description</th>
                      <th className="px-6 py-4 font-medium hidden md:table-cell">Type</th>
                      <th className="px-6 py-4 font-medium hidden sm:table-cell">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((txn) => (
                        <tr key={txn.id} className="border-b border-[#27272a] hover:bg-[#1a1a20]/50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-white group-hover:text-[#cca858] transition-colors">{txn.description}</p>
                            <p className="text-xs text-gray-500 sm:hidden mt-1 capitalize">{txn.type} • {txn.status}</p>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1a1a20] text-gray-300 capitalize border border-[#27272a]">
                              {txn.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 capitalize">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                              {txn.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <p className={`text-sm font-medium ${txn.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                              {txn.amount > 0 ? '+' : ''}{formatCurrency(txn.amount)}
                            </p>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                          No transactions found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
}