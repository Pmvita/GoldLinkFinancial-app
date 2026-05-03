import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Plus, Receipt, Zap, ShieldCheck } from 'lucide-react';

export default function BillPay({ user, onLogout }) {
  const bills = [
    { id: 1, payee: 'Amex Centurion Card', due: '2026-05-15', amount: 84500.00, status: 'pending' },
    { id: 2, payee: 'St. Regis Residences', due: '2026-05-18', amount: 15000.00, status: 'pending' },
    { id: 3, payee: 'Four Seasons Private Jet', due: '2026-05-01', amount: 125000.00, status: 'paid' },
  ];

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-white mb-2">Concierge Bill Pay</h1>
            <p className="text-gray-400">Automate and manage your premium obligations.</p>
          </div>
          <Button className="bg-[#cca858] hover:bg-[#b5954a] text-[#121217] shadow-lg shadow-[#cca858]/20 w-full sm:w-auto h-12">
            <Plus className="h-4 w-4 mr-2" /> Add Payee
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#121217] border-[#27272a]">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-white">Upcoming Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bills.map((bill) => (
                  <div key={bill.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-[#0a0a0c] border border-[#27272a] hover:border-[#cca858]/30 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${bill.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#1a1a20] text-[#cca858]'}`}>
                        {bill.status === 'paid' ? <ShieldCheck className="h-6 w-6" /> : <Receipt className="h-6 w-6" />}
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-lg">{bill.payee}</h4>
                        <p className="text-sm text-gray-500">Due: {new Date(bill.due).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 sm:gap-1">
                      <p className="text-xl text-white font-light">${bill.amount.toLocaleString()}</p>
                      {bill.status === 'pending' ? (
                        <Button size="sm" className="bg-[#1a1a20] hover:bg-[#27272a] text-white border border-[#27272a]">Pay Now</Button>
                      ) : (
                        <span className="text-emerald-400 text-sm font-medium">Paid</span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-[#121217] to-[#1a1a20] border-[#cca858]/30">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#cca858]" /> Auto-Pay Concierge
                </CardTitle>
                <CardDescription className="text-gray-400">Let us handle the details.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                  Your Private Advisor can automatically review and process recurring bills, property taxes, and staff payrolls.
                </p>
                <Button className="w-full bg-[#cca858] hover:bg-[#b5954a] text-[#121217]">
                  Configure Auto-Pay
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}