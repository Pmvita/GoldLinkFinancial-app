import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { CreditCard, Lock, Unlock, Key, AlertTriangle, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import cardsData from '../../../db/cards.json';
import transactionsData from '../../../db/transactions.json';

export default function Cards({ user, onLogout }) {
  const [userCards, setUserCards] = useState([]);
  const [changePinCard, setChangePinCard] = useState(null);
  const [cardTransactions, setCardTransactions] = useState([]);

  useEffect(() => {
    const cards = cardsData.cards.filter(card => card.userId === user.id);
    setUserCards(cards);

    const cardIds = cards.map(c => c.id);
    const transactions = transactionsData.transactions
      .filter(txn => cardIds.includes(txn.cardId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
    setCardTransactions(transactions);
  }, [user]);

  const toggleCardStatus = (cardId) => {
    setUserCards(userCards.map(card => {
      if (card.id === cardId) {
        const newStatus = card.status === 'active' ? 'frozen' : 'active';
        toast.success(`Card ${newStatus === 'active' ? 'activated' : 'frozen'} successfully`);
        return { ...card, status: newStatus };
      }
      return card;
    }));
  };

  const handleReportLost = (card) => {
    toast.success(`Card ••${card.lastFour} reported as lost. A replacement will be sent in 3-5 business days.`);
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
          {userCards.map((card) => (
            <div key={card.id}>
              {/* Card Visual */}
              <div className={`relative h-52 rounded-2xl p-6 text-white mb-4 ${
                card.status === 'frozen'
                  ? 'bg-gradient-to-br from-gray-600 to-gray-800'
                  : card.type === 'credit'
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
                    <div className="text-sm opacity-90 capitalize">{card.type} Card</div>
                    <div className="font-semibold text-xs mt-1">{card.network}</div>
                  </div>
                  <CreditCard className="h-8 w-8" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-xl sm:text-2xl tracking-wider font-mono truncate">
                      •••• •••• •••• {card.lastFour}
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-75">Expires</div>
                      <div className="font-mono">{card.expiryDate}</div>
                    </div>
                    {card.type === 'credit' && (
                      <div className="text-right">
                        <div className="text-xs opacity-75">Available</div>
                        <div className="font-semibold">
                          ${card.availableCredit.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Controls */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  {card.type === 'credit' && card.rewardsPoints && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-900 font-medium">
                        Rewards Balance: {card.rewardsPoints.toLocaleString()} points
                      </div>
                      {card.nextPaymentDue && (
                        <div className="text-xs text-purple-700 mt-1">
                          Next payment: ${card.minimumPayment.toLocaleString()} due {new Date(card.nextPaymentDue).toLocaleDateString()}
                        </div>
                      )}
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
                        <DialogTitle>Change PIN for Card ••{card.lastFour}</DialogTitle>
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
        {cardTransactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Card Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cardTransactions.map((transaction) => {
                  const card = userCards.find(c => c.id === transaction.cardId);
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{transaction.merchant}</div>
                          <div className="text-sm text-gray-500 truncate">
                            {card?.name} (••{card?.lastFour}) • {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-gray-900">${Math.abs(transaction.amount).toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
