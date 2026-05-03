import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Camera, Upload, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Progress } from './ui/progress';

const accounts = [
  { id: 1, name: 'Checking Account', balance: 12458.32, number: '****4521' },
  { id: 2, name: 'Savings Account', balance: 45230.85, number: '****7832' },
];

const recentDeposits = [
  { id: 1, amount: 1250.00, date: '2026-04-28', status: 'Completed', account: 'Checking' },
  { id: 2, amount: 850.50, date: '2026-04-15', status: 'Completed', account: 'Checking' },
  { id: 3, amount: 2100.00, date: '2026-04-02', status: 'Completed', account: 'Savings' },
];

export default function MobileDeposit({ user, onLogout }) {
  const [step, setStep] = useState('upload');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (side, event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (side === 'front') {
          setFrontImage(e.target.result);
        } else {
          setBackImage(e.target.result);
        }
        toast.success(`${side === 'front' ? 'Front' : 'Back'} of check uploaded`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = () => {
    if (!selectedAccount || !amount || !frontImage || !backImage) {
      toast.error('Please complete all required fields');
      return;
    }

    setProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setStep('success');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleNewDeposit = () => {
    setStep('upload');
    setSelectedAccount('');
    setAmount('');
    setFrontImage(null);
    setBackImage(null);
    setProgress(0);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Mobile Check Deposit</h1>
        </div>

        {step === 'upload' && (
          <>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Before you start:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Endorse the back of your check with your signature</li>
                      <li>Write "For Mobile Deposit Only" below your signature</li>
                      <li>Take photos in a well-lit area with a plain background</li>
                      <li>Ensure all four corners of the check are visible</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deposit Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deposit-account">Deposit To</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger id="deposit-account">
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

                <div className="space-y-2">
                  <Label htmlFor="check-amount">Check Amount</Label>
                  <Input
                    id="check-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Front of Check</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      {frontImage ? (
                        <div className="space-y-2">
                          <img src={frontImage} alt="Front of check" className="mx-auto max-h-48 rounded" />
                          <Button variant="outline" size="sm" onClick={() => setFrontImage(null)}>
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={(e) => handleImageUpload('front', e)}
                          />
                          <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">Take or upload photo</p>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Back of Check</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      {backImage ? (
                        <div className="space-y-2">
                          <img src={backImage} alt="Back of check" className="mx-auto max-h-48 rounded" />
                          <Button variant="outline" size="sm" onClick={() => setBackImage(null)}>
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={(e) => handleImageUpload('back', e)}
                          />
                          <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">Take or upload photo</p>
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {processing ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing deposit...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleProcess}
                    disabled={!selectedAccount || !amount || !frontImage || !backImage}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Deposit
                  </Button>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {step === 'success' && (
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold">Deposit Submitted Successfully!</h2>
                <p className="text-gray-600">
                  Your check for ${amount} has been submitted for processing.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit Amount:</span>
                    <span className="font-semibold">${amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit To:</span>
                    <span className="font-semibold">
                      {accounts.find(a => a.id === Number(selectedAccount))?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Availability:</span>
                    <span className="font-semibold">1-2 business days</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Please retain your check for 14 days, then destroy it securely.
                </p>
                <Button onClick={handleNewDeposit} className="w-full">Make Another Deposit</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Deposits */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDeposits.map((deposit) => (
                <div key={deposit.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">${deposit.amount.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">{deposit.account} • {deposit.date}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      {deposit.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
