import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeftRight, Send, Building2, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const accounts = [
  { id: 1, name: 'Checking Account', balance: 12458.32, number: '****4521' },
  { id: 2, name: 'Savings Account', balance: 45230.85, number: '****7832' },
];

const recentRecipients = [
  { id: 1, name: 'Jane Doe', email: 'jane@example.com', type: 'P2P' },
  { id: 2, name: 'John Smith', email: 'john@example.com', type: 'P2P' },
  { id: 3, name: 'Acme Corp', accountNumber: '****8901', type: 'Wire' },
];

export default function Transfers({ user, onLogout }) {
  const [fromAccount, setFromAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [transferType, setTransferType] = useState('internal');

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!fromAccount || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Transfer initiated successfully');
    setAmount('');
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Transfers</h1>
        </div>

        <Tabs defaultValue="internal" onValueChange={setTransferType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="internal">
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Internal
            </TabsTrigger>
            <TabsTrigger value="p2p">
              <User className="h-4 w-4 mr-2" />
              P2P Transfer
            </TabsTrigger>
            <TabsTrigger value="wire">
              <Building2 className="h-4 w-4 mr-2" />
              Wire Transfer
            </TabsTrigger>
          </TabsList>

          {/* Internal Transfer */}
          <TabsContent value="internal">
            <Card>
              <CardHeader>
                <CardTitle>Transfer Between Your Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransfer} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from-account">From Account</Label>
                      <Select value={fromAccount} onValueChange={setFromAccount}>
                        <SelectTrigger id="from-account">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={String(account.id)}>
                              {account.name} ({account.number}) - ${account.balance.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to-account">To Account</Label>
                      <Select>
                        <SelectTrigger id="to-account">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={String(account.id)}>
                              {account.name} ({account.number})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memo">Memo (Optional)</Label>
                    <Input id="memo" placeholder="Add a note" />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Transfer Now
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* P2P Transfer */}
          <TabsContent value="p2p">
            <Card>
              <CardHeader>
                <CardTitle>Send Money to People</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransfer} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="p2p-from">From Account</Label>
                    <Select value={fromAccount} onValueChange={setFromAccount}>
                      <SelectTrigger id="p2p-from">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={String(account.id)}>
                            {account.name} ({account.number}) - ${account.balance.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient-email">Recipient Email or Phone</Label>
                    <Input id="recipient-email" placeholder="email@example.com or +1234567890" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p2p-amount">Amount</Label>
                    <Input
                      id="p2p-amount"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p2p-message">Message</Label>
                    <Input id="p2p-message" placeholder="What's this for?" />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Money
                  </Button>
                </form>

                {/* Recent Recipients */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Recent Recipients</h3>
                  <div className="space-y-2">
                    {recentRecipients.filter(r => r.type === 'P2P').map((recipient) => (
                      <div
                        key={recipient.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <div>
                          <div className="font-medium">{recipient.name}</div>
                          <div className="text-sm text-gray-500">{recipient.email}</div>
                        </div>
                        <Button size="sm" variant="outline">Send</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wire Transfer */}
          <TabsContent value="wire">
            <Card>
              <CardHeader>
                <CardTitle>Wire Transfer</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransfer} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wire-from">From Account</Label>
                    <Select value={fromAccount} onValueChange={setFromAccount}>
                      <SelectTrigger id="wire-from">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={String(account.id)}>
                            {account.name} ({account.number}) - ${account.balance.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="beneficiary-name">Beneficiary Name</Label>
                      <Input id="beneficiary-name" placeholder="Full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="beneficiary-bank">Beneficiary Bank</Label>
                      <Input id="beneficiary-bank" placeholder="Bank name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input id="account-number" placeholder="Account number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routing-number">Routing Number</Label>
                      <Input id="routing-number" placeholder="9-digit routing number" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wire-amount">Amount</Label>
                    <Input
                      id="wire-amount"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wire-purpose">Purpose of Transfer</Label>
                    <Input id="wire-purpose" placeholder="e.g., Invoice payment" />
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      Wire transfers are typically processed within 1-2 business days. A fee of $25 applies.
                    </p>
                  </div>
                  <Button type="submit" className="w-full">
                    <Building2 className="h-4 w-4 mr-2" />
                    Initiate Wire Transfer
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
