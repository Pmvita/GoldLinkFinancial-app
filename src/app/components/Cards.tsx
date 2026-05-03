import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CreditCard, Lock, Settings, Snowflake, Eye } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

export default function Cards({ user, onLogout }) {
  const [showNumber, setShowNumber] = useState(false);

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

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Card Visual */}
          <div className="space-y-6">
            <div className="relative aspect-[1.586/1] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col justify-between"
                 style={{ background: 'linear-gradient(135deg, #111, #000)', border: '1px solid #333' }}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #cca858 0%, transparent 60%)' }}></div>
              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[#cca858] text-xl font-serif tracking-widest">GOLDLINK</span>
                <span className="text-gray-400 text-sm tracking-widest uppercase">Reserve</span>
              </div>
              <div className="relative z-10 flex items-center mb-4">
                <div className="w-12 h-8 rounded bg-gradient-to-br from-[#d4af37] via-[#aa8822] to-[#d4af37] opacity-80"></div>
              </div>
              <div className="relative z-10 space-y-4">
                <div className="text-white text-2xl tracking-widest font-mono flex items-center gap-4">
                  {showNumber ? '4829 1102 9931 4452' : '•••• •••• •••• 4452'}
                  <button onClick={() => setShowNumber(!showNumber)} className="text-gray-500 hover:text-white">
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex justify-between text-sm uppercase tracking-widest text-gray-400">
                  <span>{user?.name || 'Valued Client'}</span>
                  <span>12/29</span>
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
                <CardTitle className="text-xl font-medium text-white">Card Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-[#27272a] pb-4">
                    <span className="text-gray-400">Status</span>
                    <span className="text-emerald-400 font-medium">Active</span>
                  </div>
                  <div className="flex justify-between border-b border-[#27272a] pb-4">
                    <span className="text-gray-400">Daily Limit</span>
                    <span className="text-white font-medium">$250,000</span>
                  </div>
                  <div className="flex justify-between border-b border-[#27272a] pb-4">
                    <span className="text-gray-400">Current Balance</span>
                    <span className="text-white font-medium">$45,200.50</span>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <h4 className="text-white font-medium">Recent Card Activity</h4>
                  <div className="space-y-3">
                    {[
                      {desc: 'Four Seasons Paris', amt: 12400},
                      {desc: 'Hermès Boutique', amt: 8500},
                      {desc: 'Private Dining Club', amt: 1200}
                    ].map((tx, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-[#0a0a0c] rounded-lg border border-[#27272a]">
                        <span className="text-white text-sm">{tx.desc}</span>
                        <span className="text-white font-medium">${tx.amt.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}