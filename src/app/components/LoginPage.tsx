import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Shield, Fingerprint, Lock } from 'lucide-react';
import { toast } from 'sonner';
import usersData from '../../../db/users.json';

export default function LoginPage({ onLogin }) {
  const [step, setStep] = useState('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [pendingUser, setPendingUser] = useState(null);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }

    // Authenticate against database
    const user = usersData.users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      setPendingUser(user);
      toast.success('Credentials verified');
      setStep('2fa');
    } else {
      toast.error('Invalid username or password');
    }
  };

  const handleBiometric = () => {
    if (pendingUser) {
      toast.success('Biometric authentication successful');
      setTimeout(() => {
        onLogin(pendingUser);
      }, 500);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      toast.success('2FA verified successfully');
      setTimeout(() => {
        onLogin(pendingUser);
      }, 500);
    } else {
      toast.error('Please enter valid 6-digit code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">GoldLink Bank</CardTitle>
          </div>
          <CardDescription>
            {step === 'credentials'
              ? 'Sign in to your account'
              : 'Verify your identity with two-factor authentication'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full">
                Continue
              </Button>

            </form>
          ) : (
            <div className="space-y-4">
              {biometricEnabled && (
                <div className="space-y-3">
                  <Button
                    onClick={handleBiometric}
                    variant="outline"
                    className="w-full h-14"
                  >
                    <Fingerprint className="h-5 w-5 mr-2" />
                    Use Biometric Authentication
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or</span>
                    </div>
                  </div>
                </div>
              )}
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Enter 6-digit code</Label>
                  <p className="text-sm text-gray-500">
                    We sent a code to your registered device
                  </p>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Verify & Sign In
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => toast.success('New code sent to your device')}
                >
                  Resend Code
                </Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
