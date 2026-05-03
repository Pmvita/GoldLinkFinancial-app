import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowRightLeft, Globe, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Transfers({ user, onLogout }) {
  const [transferType, setTransferType] = useState('internal');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState('form'); // form, processing, success

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 1500);
  };

  const resetTransfer = () => {
    setAmount('');
    setStep('form');
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-white mb-2">Wire & Transfers</h1>
            <p className="text-gray-400">Move funds globally with zero restrictions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#121217] border-[#27272a]">
              <CardHeader className="border-b border-[#27272a] bg-[#0a0a0c]/50 p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button 
                    variant={transferType === 'internal' ? 'default' : 'outline'} 
                    onClick={() => setTransferType('internal')}
                    className={transferType === 'internal' ? 'bg-[#cca858] text-[#121217] hover:bg-[#b5954a] h-12 sm:h-10' : 'border-[#27272a] text-gray-400 hover:text-white hover:bg-[#1a1a20] h-12 sm:h-10'}
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-2" /> Internal
                  </Button>
                  <Button 
                    variant={transferType === 'domestic' ? 'default' : 'outline'} 
                    onClick={() => setTransferType('domestic')}
                    className={transferType === 'domestic' ? 'bg-[#cca858] text-[#121217] hover:bg-[#b5954a] h-12 sm:h-10' : 'border-[#27272a] text-gray-400 hover:text-white hover:bg-[#1a1a20] h-12 sm:h-10'}
                  >
                    <ArrowUpRight className="h-4 w-4 mr-2" /> Domestic
                  </Button>
                  <Button 
                    variant={transferType === 'international' ? 'default' : 'outline'} 
                    onClick={() => setTransferType('international')}
                    className={transferType === 'international' ? 'bg-[#cca858] text-[#121217] hover:bg-[#b5954a] h-12 sm:h-10' : 'border-[#27272a] text-gray-400 hover:text-white hover:bg-[#1a1a20] h-12 sm:h-10'}
                  >
                    <Globe className="h-4 w-4 mr-2" /> International
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {step === 'form' && (
                  <form onSubmit={handleTransfer} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-gray-400">From Account</Label>
                        <Select defaultValue="checking">
                          <SelectTrigger className="h-14 bg-[#0a0a0c] border-[#27272a] text-white focus:ring-[#cca858]">
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#121217] border-[#27272a] text-white">
                            <SelectItem value="checking">Private Checking (•••• 4829) - $1,250,000.50</SelectItem>
                            <SelectItem value="investment">Global Investment (•••• 9931) - $8,400,000.00</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-gray-400">To Account / Recipient</Label>
                        {transferType === 'internal' ? (
                          <Select defaultValue="investment">
                            <SelectTrigger className="h-14 bg-[#0a0a0c] border-[#27272a] text-white focus:ring-[#cca858]">
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#121217] border-[#27272a] text-white">
                              <SelectItem value="checking">Private Checking (•••• 4829)</SelectItem>
                              <SelectItem value="investment">Global Investment (•••• 9931)</SelectItem>
                              <SelectItem value="trust">Offshore Trust (•••• 1120)</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Select>
                            <SelectTrigger className="h-14 bg-[#0a0a0c] border-[#27272a] text-white focus:ring-[#cca858]">
                              <SelectValue placeholder="Select saved recipient" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#121217] border-[#27272a] text-white">
                              <SelectItem value="new">+ Add New Recipient</SelectItem>
                              <SelectItem value="r1">Sotheby's Escrow Account</SelectItem>
                              <SelectItem value="r2">Cayman Islands Holding Ltd</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-gray-400">Amount (USD)</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500">$</span>
                        <Input 
                          type="number" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="h-16 sm:h-20 pl-12 text-3xl sm:text-4xl font-light bg-[#0a0a0c] border-[#27272a] text-white focus-visible:ring-[#cca858]"
                        />
                      </div>
                    </div>

                    {transferType !== 'internal' && (
                      <div className="space-y-3">
                        <Label className="text-gray-400">Memo / Reference</Label>
                        <Input 
                          placeholder="Add a note (optional)"
                          className="h-12 bg-[#0a0a0c] border-[#27272a] text-white focus-visible:ring-[#cca858]"
                        />
                      </div>
                    )}

                    <div className="pt-4 flex justify-end">
                      <Button type="submit" className="h-14 px-8 text-lg font-medium bg-[#cca858] hover:bg-[#b5954a] text-[#121217] transition-all w-full md:w-auto">
                        Authorize Transfer
                      </Button>
                    </div>
                  </form>
                )}

                {step === 'processing' && (
                  <div className="py-20 flex flex-col items-center justify-center space-y-6">
                    <div className="w-16 h-16 border-4 border-[#27272a] border-t-[#cca858] rounded-full animate-spin"></div>
                    <h3 className="text-xl text-white font-medium">Securing transaction...</h3>
                    <p className="text-gray-400">Authenticating via quantum encryption.</p>
                  </div>
                )}

                {step === 'success' && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-light text-white">Transfer Authorized</h3>
                      <p className="text-gray-400 text-lg">Your funds are being moved securely.</p>
                    </div>
                    <div className="bg-[#0a0a0c] border border-[#27272a] rounded-xl p-6 w-full max-w-sm space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Amount</span>
                        <span className="text-white font-medium">${Number(amount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fee</span>
                        <span className="text-emerald-400 font-medium">Waived</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Reference ID</span>
                        <span className="text-white font-mono text-sm">TRX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                      </div>
                    </div>
                    <Button onClick={resetTransfer} variant="outline" className="border-[#27272a] text-white hover:bg-[#1a1a20] h-12 px-8">
                      Make Another Transfer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#121217] border-[#27272a]">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Limits & Permissions</CardTitle>
                <CardDescription className="text-gray-400">Your daily transfer capacities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Daily Domestic Wire</span>
                    <span className="text-gray-400">$2.5M / $5.0M</span>
                  </div>
                  <div className="w-full bg-[#0a0a0c] rounded-full h-2">
                    <div className="bg-[#cca858] h-2 rounded-full" style={{width: '50%'}}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Daily International Wire</span>
                    <span className="text-gray-400">$0.0M / $10.0M</span>
                  </div>
                  <div className="w-full bg-[#0a0a0c] rounded-full h-2">
                    <div className="bg-[#cca858] h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
                <div className="p-4 bg-[#cca858]/10 rounded-lg border border-[#cca858]/20">
                  <p className="text-sm text-[#cca858]">Need higher limits? Contact your Private Advisor to arrange exceptional transfers.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}