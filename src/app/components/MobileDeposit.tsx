import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Camera, Upload, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function MobileDeposit({ user, onLogout }) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState('form');

  const handleDeposit = (e) => {
    e.preventDefault();
    if (!amount) {
      toast.error('Please enter an amount');
      return;
    }
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 2000);
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
            <h1 className="text-3xl md:text-4xl font-light text-white mb-2">Check Deposit</h1>
            <p className="text-gray-400">Securely deposit checks to your accounts.</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
          <Card className="bg-[#121217] border-[#27272a]">
            <CardHeader className="text-center pb-8 border-b border-[#27272a]">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#cca858]/10 flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-[#cca858]" />
              </div>
              <CardTitle className="text-2xl font-light text-white">Deposit a Check</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
              {step === 'form' && (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleDeposit} 
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <Label className="text-gray-400">Deposit To</Label>
                    <Select defaultValue="checking">
                      <SelectTrigger className="h-14 bg-[#0a0a0c] border-[#27272a] text-white focus:ring-[#cca858]">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121217] border-[#27272a] text-white">
                        <SelectItem value="checking">Private Checking (•••• 4829)</SelectItem>
                        <SelectItem value="investment">Global Investment (•••• 9931)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-400">Check Amount (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">$</span>
                      <Input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="h-16 pl-10 text-2xl font-light bg-[#0a0a0c] border-[#27272a] text-white focus-visible:ring-[#cca858]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="border-2 border-dashed border-[#27272a] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#cca858]/50 hover:bg-[#0a0a0c] transition-all h-32">
                      <Upload className="h-6 w-6 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-300">Front of Check</span>
                    </div>
                    <div className="border-2 border-dashed border-[#27272a] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#cca858]/50 hover:bg-[#0a0a0c] transition-all h-32">
                      <Upload className="h-6 w-6 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-300">Back of Check</span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button type="submit" className="w-full h-14 text-lg font-medium bg-[#cca858] hover:bg-[#b5954a] text-[#121217]">
                      Submit Deposit
                    </Button>
                  </div>
                </motion.form>
              )}

              {step === 'processing' && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="py-12 flex flex-col items-center justify-center space-y-6"
                >
                  <div className="w-16 h-16 border-4 border-[#27272a] border-t-[#cca858] rounded-full animate-spin"></div>
                  <h3 className="text-xl text-white font-medium">Analyzing check...</h3>
                  <p className="text-gray-400 text-center">Verifying amounts and signatures securely.</p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 flex flex-col items-center justify-center space-y-6 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-light text-white">Deposit Received</h3>
                  <p className="text-gray-400">Your check for <strong className="text-white">${Number(amount).toLocaleString()}</strong> is being processed.</p>
                  <p className="text-sm text-[#cca858] bg-[#cca858]/10 p-3 rounded-lg border border-[#cca858]/20">
                    Funds will be available immediately per your account tier limits.
                  </p>
                  <div className="pt-4 w-full space-y-3">
                    <Button onClick={() => { setAmount(''); setStep('form'); }} className="w-full h-12 bg-[#1a1a20] hover:bg-[#27272a] text-white border border-[#27272a]">
                      Deposit Another Check
                    </Button>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
}