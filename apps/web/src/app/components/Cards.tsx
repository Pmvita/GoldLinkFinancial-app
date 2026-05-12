import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Lock, Settings, Snowflake, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import cardsData from '../../../../../db/cards.json';
import usersData from '../../../../../db/users.json';
import transactionsData from '../../../../../db/transactions.json';

type UserCard = (typeof cardsData)['cards'][number];
type Txn = (typeof transactionsData)['transactions'][number];

export default function Cards({ user, onLogout }) {
  const [showNumber, setShowNumber] = useState(false);
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [cardholderName, setCardholderName] = useState<string>(user?.fullName || user?.name || 'Valued Client');

  useEffect(() => {
    const cards = cardsData.cards.filter(c => c.userId === user.id);
    setUserCards(cards);

    const fullUser = usersData.users.find(u => u.id === user.id);
    if (fullUser) {
      setCardholderName(fullUser.fullName);
    }
  }, [user]);

  const getCardActivity = (cardId: string): Txn[] => {
    return transactionsData.transactions
      .filter(t => t.cardId === cardId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

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

  return (
    <Layout user={user} onLogout={onLogout}>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-white mb-2">Cards & Access</h1>
            <p className="text-gray-400">Control your global purchasing power.</p>
          </div>
          <Button variant="outline" className="border-[#27272a] text-white hover:bg-[#1a1a20]">
            <Settings className="h-4 w-4 mr-2" /> Card Settings
          </Button>
        </motion.div>

        {userCards.length === 0 && (
          <motion.div variants={itemVariants}>
            <Card className="bg-[#121217] border-[#27272a]">
              <CardContent className="p-8 text-center text-gray-400">
                No cards on file for your account. Contact your Private Advisor to issue one.
              </CardContent>
            </Card>
          </motion.div>
        )}

        {userCards.map((card) => {
          const activity = getCardActivity(card.id);
          const formattedNumber = card.cardNumber
            ? card.cardNumber.replace(/(.{4})/g, '$1 ').trim()
            : `•••• •••• •••• ${card.lastFour}`;
          const maskedNumber = `•••• •••• •••• ${card.lastFour}`;
          const isCredit = card.type === 'credit';

          return (
            <motion.div key={card.id} variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Card Visual */}
              <div className="space-y-6">
                <div className="relative aspect-[1.586/1] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col justify-between"
                     style={{ background: 'linear-gradient(135deg, #111, #000)', border: '1px solid #333' }}>
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #cca858 0%, transparent 60%)' }}></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="text-[#cca858] text-xl font-serif tracking-widest">GOLDLINK</span>
                    <span className="text-gray-400 text-sm tracking-widest uppercase">{card.network || 'Reserve'}</span>
                  </div>
                  <div className="relative z-10 flex items-center mb-4">
                    <div className="w-12 h-8 rounded bg-gradient-to-br from-[#d4af37] via-[#aa8822] to-[#d4af37] opacity-80"></div>
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="text-white text-2xl tracking-widest font-mono flex items-center gap-4">
                      {showNumber ? formattedNumber : maskedNumber}
                      <button onClick={() => setShowNumber(!showNumber)} className="text-gray-500 hover:text-white">
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex justify-between text-sm uppercase tracking-widest text-gray-400">
                      <span>{cardholderName}</span>
                      <span>{card.expiryDate || '••/••'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button variant="outline" className="h-14 border-[#27272a] bg-[#121217] text-white hover:bg-[#1a1a20]">
                    <Snowflake className="h-4 w-4 mr-2 text-blue-400" /> Freeze Card
                  </Button>
                  <Button variant="outline" className="h-14 border-[#27272a] bg-[#121217] text-white hover:bg-[#1a1a20]">
                    <Lock className="h-4 w-4 mr-2 text-red-400" /> Change PIN
                  </Button>
                </div>
              </div>

              {/* Card Details */}
              <div className="space-y-6">
                <Card className="bg-[#121217] border-[#27272a]">
                  <CardHeader>
                    <CardTitle className="text-xl font-medium text-white">{card.name || 'Card Details'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-[#27272a] pb-4">
                        <span className="text-gray-400">Status</span>
                        <span className={`${card.status === 'active' ? 'text-emerald-400' : 'text-red-400'} font-medium capitalize`}>
                          {card.status || 'Active'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#27272a] pb-4">
                        <span className="text-gray-400">{isCredit ? 'Credit Limit' : 'Daily Limit'}</span>
                        {/* TODO: backfill dailyLimit field for debit/non-credit cards in db/cards.json */}
                        <span className="text-white font-medium">
                          {isCredit ? formatCurrency(card.creditLimit) : formatCurrency(250000)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#27272a] pb-4">
                        <span className="text-gray-400">{isCredit ? 'Current Balance' : 'Linked Account'}</span>
                        <span className="text-white font-medium">
                          {isCredit ? formatCurrency(card.balance) : card.accountId}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-4">
                      <h4 className="text-white font-medium">Recent Card Activity</h4>
                      <div className="space-y-3">
                        {activity.length > 0 ? activity.map((tx) => (
                          <div key={tx.id} className="flex justify-between items-center p-3 bg-[#0a0a0c] rounded-lg border border-[#27272a]">
                            <span className="text-white text-sm truncate max-w-[180px]">{tx.description}</span>
                            <span className="text-white font-medium">{formatCurrency(Math.abs(tx.amount))}</span>
                          </div>
                        )) : (
                          <p className="text-sm text-gray-500">No recent activity recorded for this card.</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Layout>
  );
}
