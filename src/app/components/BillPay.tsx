import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Plus, Calendar as CalendarIcon, Trash2, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import accountsData from '../../../db/accounts.json';
import payeesData from '../../../db/payees.json';

export default function BillPay({ user, onLogout }) {
  const [showAddPayee, setShowAddPayee] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);
  const [userPayees, setUserPayees] = useState([]);

  useEffect(() => {
    const accounts = accountsData.accounts.filter(acc => acc.userId === user.id);
    setUserAccounts(accounts);

    const payees = payeesData.payees.filter(p => p.userId === user.id);
    setUserPayees(payees);
  }, [user]);

  const handlePayNow = (payee) => {
    toast.success(`Payment of $${payee.defaultAmount} scheduled for ${payee.name}`);
  };

  const handleAddPayee = (e) => {
    e.preventDefault();
    toast.success('New payee added successfully');
    setShowAddPayee(false);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Bill Pay</h1>
          <Button onClick={() => setShowAddPayee(!showAddPayee)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Payee
          </Button>
        </div>

        {/* Add Payee Form */}
        {showAddPayee && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Payee</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPayee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payee-name">Payee Name</Label>
                    <Input id="payee-name" placeholder="Company or person name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payee-category">Category</Label>
                    <Select>
                      <SelectTrigger id="payee-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payee-account">Account Number</Label>
                    <Input id="payee-account" placeholder="Account or reference number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payee-amount">Default Amount</Label>
                    <Input id="payee-amount" type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Payee</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddPayee(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Bills */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userPayees
                .sort((a, b) => new Date(a.recurringPayment?.nextDue || '9999-12-31').getTime() - new Date(b.recurringPayment?.nextDue || '9999-12-31').getTime())
                .map((payee) => {
                  const nextDue = payee.recurringPayment?.nextDue || '2026-05-15';
                  const daysUntilDue = Math.ceil(
                    (new Date(nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isOverdue = daysUntilDue < 0;
                  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

                  return (
                    <div
                      key={payee.id}
                      className={`p-4 rounded-lg border-2 ${
                        isOverdue
                          ? 'border-red-200 bg-red-50'
                          : isDueSoon
                          ? 'border-yellow-200 bg-yellow-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{payee.name}</h3>
                            {payee.recurringPayment?.enabled && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex-shrink-0">
                                Recurring
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 capitalize">
                            <span className="truncate">{payee.category.replace('_', ' ')}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="truncate">{payee.accountNumber}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className={isOverdue ? 'text-red-600 font-medium' : isDueSoon ? 'text-yellow-700 font-medium' : ''}>
                              Due {nextDue} ({daysUntilDue > 0 ? `${daysUntilDue} days` : isOverdue ? 'Overdue' : 'Today'})
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="text-right sm:mr-4 flex-1 sm:flex-none">
                            <div className="text-2xl font-bold text-gray-900">${payee.defaultAmount.toFixed(2)}</div>
                          </div>
                          <Button onClick={() => handlePayNow(payee)} className="flex-1 sm:flex-none">Pay Now</Button>
                          <Button variant="outline" size="icon" className="flex-shrink-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="flex-shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Payment */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule a Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-from">From Account</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger id="payment-from">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {userAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} (••••{account.accountNumber.slice(-4)}) - ${account.balance.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-payee">Payee</Label>
                  <Select>
                    <SelectTrigger id="payment-payee">
                      <SelectValue placeholder="Select payee" />
                    </SelectTrigger>
                    <SelectContent>
                      {userPayees.map((payee) => (
                        <SelectItem key={payee.id} value={String(payee.id)}>
                          {payee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-amount">Amount</Label>
                  <Input id="payment-amount" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Payment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {paymentDate ? format(paymentDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={paymentDate} onSelect={setPaymentDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
                <Label htmlFor="recurring">Make this a recurring payment</Label>
              </div>
              {isRecurring && (
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select>
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button type="submit" className="w-full">Schedule Payment</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
