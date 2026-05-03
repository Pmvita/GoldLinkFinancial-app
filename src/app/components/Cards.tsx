import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { CreditCard, Lock, Unlock, Key, AlertTriangle, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const mockCards = [
  {
    id: 1,
    type: 'Credit',
    name: 'Rewards Credit Card',
    lastFour: '3421',
    balance: 2145.67,
    limit: 10000,
    status: 'active',
    expiryDate: '12/28',
    rewards: 2145,
  },
  {
    id: 2,
    type: 'Debit',
    name: 'Checking Debit Card',
    lastFour: '4521',
    status: 'active',
    expiryDate: '08/27',
  },
  {
    id: 3,
    type: 'Debit',
    name: 'Savings Debit Card',
    lastFour: '7832',
    status: 'frozen',
    expiryDate: '03/28',
  },
];

const recentTransactions = [
  { id: 1, merchant: 'Amazon.com', amount: 127.45, date: '2026-05-02', card: '3421' },
  { id: 2, merchant: 'Starbucks', amount: 8.50, date: '2026-05-01', card: '4521' },
  { id: 3, merchant: 'Gas Station', amount: 62.18, date: '2026-04-30', card: '4521' },
  { id: 4, merchant: 'Restaurant', amount: 85.40, date: '2026-04-29', card: '3421' },
];

export default function Cards({ user, onLogout }) {
  const [cards, setCards] = useState(mockCards);
  const [changePinCard, setChangePinCard] = useState(null);

  const toggleCardStatus = (cardId) => {
    setCards(cards.map(card => {
      if (card.id === cardId) {
        const newStatus = card.status === 'active' ? 'frozen' : 'active';
        toast.success(`Card ${newStatus === 'active' ? 'activated' : 'frozen'} successfully`);
        return { ...card, status: newStatus };
      }
      return card;
    }));
  };

  const handleReportLost = (card) => {
    toast.success(`Card ${card.lastFour} reported as lost. A replacement will be sent in 3-5 business days.`);
  };

  const handleChangePin = (e) => {
    e.preventDefault();
    toast.success('PIN changed successfully');
    setChangePinCard(null);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Card Management</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Request New Card
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div key={card.id}>
              {/* Card Visual */}
              <div className={`relative h-52 rounded-2xl p-6 text-white mb-4 ${
                card.status === 'frozen'
                  ? 'bg-gradient-to-br from-gray-600 to-gray-800'
                  : card.type === 'Credit'
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-800'
                  : 'bg-gradient-to-br from-blue-600 to-cyan-700'
              }`}>
                {card.status === 'frozen' && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="h-12 w-12 mx-auto mb-2" />
                      <p className="font-semibold">Card Frozen</p>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="text-sm opacity-90">{card.type} Card</div>
                    <div className="font-semibold">{card.name}</div>
                  </div>
                  <CreditCard className="h-8 w-8" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl tracking-wider font-mono">
                      •••• •••• •••• {card.lastFour}
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-75">Expires</div>
                      <div className="font-mono">{card.expiryDate}</div>
                    </div>
                    {card.type === 'Credit' && (
                      <div className="text-right">
                        <div className="text-xs opacity-75">Available</div>
                        <div className="font-semibold">
                          ${(card.limit - card.balance).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Controls */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  {card.type === 'Credit' && card.rewards && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-900 font-medium">
                        Rewards Balance: {card.rewards.toLocaleString()} points
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label htmlFor={`freeze-${card.id}`} className="flex items-center gap-2">
                      {card.status === 'active' ? (
                        <Unlock className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                      {card.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}
                    </Label>
                    <Switch
                      id={`freeze-${card.id}`}
                      checked={card.status === 'frozen'}
                      onCheckedChange={() => toggleCardStatus(card.id)}
                    />
                  </div>

                  <Dialog open={changePinCard?.id === card.id} onOpenChange={(open) => !open && setChangePinCard(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setChangePinCard(card)}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Change PIN
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change PIN for Card {card.lastFour}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleChangePin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-pin">Current PIN</Label>
                          <Input
                            id="current-pin"
                            type="password"
                            maxLength={4}
                            placeholder="••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-pin">New PIN</Label>
                          <Input
                            id="new-pin"
                            type="password"
                            maxLength={4}
                            placeholder="••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-pin">Confirm New PIN</Label>
                          <Input
                            id="confirm-pin"
                            type="password"
                            maxLength={4}
                            placeholder="••••"
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Update PIN
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700"
                    onClick={() => handleReportLost(card)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report Lost or Stolen
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Recent Card Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Card Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const card = cards.find(c => c.lastFour === transaction.card);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.merchant}</div>
                        <div className="text-sm text-gray-500">
                          {card?.name} (••{transaction.card}) • {transaction.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${transaction.amount.toFixed(2)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
