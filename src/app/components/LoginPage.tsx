import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Label } from './ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Shield, Fingerprint, Lock, ArrowRight, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import usersData from '../../../db/users.json';

export default function LoginPage({ onLogin }) {
  const [step, setStep] = useState('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [otp, setOtp] = useState('');
  const [pendingUser, setPendingUser] = useState(null);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }

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

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Simulate signup success
    const newUser = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name: signupName,
      username: signupEmail,
      email: signupEmail,
      tier: "demo",
      settings: {
        biometrics: true,
        notifications: true,
        twoFactor: true
      }
    };
    
    setPendingUser(newUser);
    toast.success('Account created successfully');
    setStep('2fa');
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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0c]">
      {/* Hero Section */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-[#121217] to-[#0a0a0c] border-r border-[#27272a] relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#cca858] opacity-5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#121217] opacity-50 blur-[100px]"></div>
        
        <div className="relative z-10 flex items-center gap-3 mb-8">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e6cc80] via-[#cca858] to-[#997a3d] p-[1px] shadow-lg shadow-[#cca858]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-gradient-to-br from-[#1a1a20] to-[#121217]">
              <span className="font-serif text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#e6cc80] to-[#cca858]">GL</span>
            </div>
          </div>
          <span className="text-3xl font-light text-white tracking-wider uppercase">GoldLink<span className="font-semibold text-[#cca858]">Bank</span></span>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-light text-white leading-tight mb-6">
            Private banking for the <span className="font-medium text-[#cca858]">extraordinary</span>.
          </h1>
          <p className="text-lg text-gray-400 font-light leading-relaxed mb-8">
            Experience unparalleled financial services, bespoke wealth management, and uncompromising security.
          </p>
          
          <div className="flex gap-4 items-center mt-12">
            <div className="flex -space-x-4">
              {[1,2,3].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-[#121217] bg-gray-800 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Member" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-white font-medium">Join 10,000+</span> elite members worldwide
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-sm text-gray-500">
          © 2026 GoldLink Bank Private Wealth. All rights reserved.
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative bg-[#0a0a0c]">
        {/* Mobile Logo */}
        <div className="absolute top-6 left-6 md:hidden flex items-center gap-2">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#e6cc80] via-[#cca858] to-[#997a3d] p-[1px] shadow-sm shadow-[#cca858]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-gradient-to-br from-[#1a1a20] to-[#121217]">
              <span className="font-serif text-sm font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#e6cc80] to-[#cca858]">GL</span>
            </div>
          </div>
          <span className="text-xl font-light text-white tracking-wider">GoldLink</span>
        </div>

        <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
          <CardHeader className="space-y-3 px-0 pt-0">
            <CardTitle className="text-3xl font-light text-white">
              {step === 'credentials' && 'Welcome back'}
              {step === 'signup' && 'Request an invitation'}
              {step === '2fa' && 'Verify identity'}
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              {step === 'credentials' && 'Enter your credentials to access your wealth.'}
              {step === 'signup' && 'Begin your journey with GoldLink Private Wealth.'}
              {step === '2fa' && 'Please complete two-factor authentication.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {step === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">Username or Email</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="bg-[#121217] border-[#27272a] text-white h-12 focus-visible:ring-[#cca858]"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <a href="#" className="text-sm text-[#cca858] hover:text-[#e6cc80] transition-colors">Forgot password?</a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="bg-[#121217] border-[#27272a] text-white h-12 focus-visible:ring-[#cca858]"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium bg-[#cca858] hover:bg-[#b5954a] text-[#121217] transition-all">
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="mt-8 text-center text-sm text-gray-400">
                  Not a client yet?{' '}
                  <button type="button" onClick={() => setStep('signup')} className="text-[#cca858] hover:text-[#e6cc80] font-medium transition-colors">
                    Request an invitation
                  </button>
                </div>
              </form>
            )}

            {step === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signupName" className="text-gray-300">Full Legal Name</Label>
                  <Input
                    id="signupName"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="bg-[#121217] border-[#27272a] text-white h-12 focus-visible:ring-[#cca858]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupEmail" className="text-gray-300">Email Address</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="bg-[#121217] border-[#27272a] text-white h-12 focus-visible:ring-[#cca858]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupPassword" className="text-gray-300">Create Password</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="bg-[#121217] border-[#27272a] text-white h-12 focus-visible:ring-[#cca858]"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium bg-[#cca858] hover:bg-[#b5954a] text-[#121217] transition-all">
                  Submit Application <UserPlus className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="mt-8 text-center text-sm text-gray-400">
                  Already a client?{' '}
                  <button type="button" onClick={() => setStep('credentials')} className="text-[#cca858] hover:text-[#e6cc80] font-medium transition-colors">
                    Sign in to your account
                  </button>
                </div>
              </form>
            )}

            {step === '2fa' && (
              <div className="space-y-6">
                {biometricEnabled && (
                  <div className="space-y-4">
                    <Button
                      onClick={handleBiometric}
                      variant="outline"
                      className="w-full h-14 bg-[#121217] border-[#27272a] text-white hover:bg-[#1a1a20] hover:text-[#cca858] transition-all"
                    >
                      <Fingerprint className="h-5 w-5 mr-3 text-[#cca858]" />
                      Authenticate with Face ID
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[#27272a]" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#0a0a0c] px-3 text-gray-500 font-medium tracking-widest">Or use code</span>
                      </div>
                    </div>
                  </div>
                )}
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                        className="gap-2"
                      >
                        <InputOTPGroup className="gap-2">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <InputOTPSlot 
                              key={index} 
                              index={index} 
                              className="w-12 h-14 text-xl border-[#27272a] bg-[#121217] text-white focus:border-[#cca858] focus:ring-1 focus:ring-[#cca858]"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <p className="text-center text-sm text-gray-400">
                      Enter the 6-digit verification code sent to your registered secure device.
                    </p>
                  </div>
                  <Button type="submit" className="w-full h-12 text-base font-medium bg-[#cca858] hover:bg-[#b5954a] text-[#121217] transition-all">
                    <Lock className="h-4 w-4 mr-2" />
                    Verify Identity
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white"
                    onClick={() => toast.success('New code sent to your secure device')}
                  >
                    Resend Code
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}