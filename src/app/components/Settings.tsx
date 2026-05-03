import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { User, Bell, Shield, Key } from 'lucide-react';

export default function Settings({ user, onLogout }) {
  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-white mb-2">Preferences</h1>
          <p className="text-gray-400">Configure your banking experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            {[
              { icon: User, label: 'Profile' },
              { icon: Shield, label: 'Security' },
              { icon: Bell, label: 'Notifications' },
              { icon: Key, label: 'API Access' }
            ].map((item, i) => (
              <Button key={i} variant="ghost" className={`w-full justify-start h-12 ${i === 0 ? 'bg-[#1a1a20] text-[#cca858]' : 'text-gray-400 hover:text-white hover:bg-[#1a1a20]'}`}>
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Button>
            ))}
          </div>

          <div className="md:col-span-3 space-y-6">
            <Card className="bg-[#121217] border-[#27272a]">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-white">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-400">Legal Name</Label>
                    <div className="p-3 bg-[#0a0a0c] border border-[#27272a] rounded-lg text-white">
                      {user?.name || 'Valued Client'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Primary Email</Label>
                    <div className="p-3 bg-[#0a0a0c] border border-[#27272a] rounded-lg text-white">
                      {user?.email || 'client@goldlink.com'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Phone</Label>
                    <div className="p-3 bg-[#0a0a0c] border border-[#27272a] rounded-lg text-white">
                      +1 (555) 123-4567
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Advisor</Label>
                    <div className="p-3 bg-[#0a0a0c] border border-[#27272a] rounded-lg text-[#cca858]">
                      Eleanor Sterling
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button className="bg-[#cca858] hover:bg-[#b5954a] text-[#121217]">
                    Request Profile Update
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#121217] border-[#27272a]">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-white">Security Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-white font-medium">Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-gray-400">Require code for all logins and transfers.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-white font-medium">Biometric Access</p>
                    <p className="text-sm text-gray-400">Use FaceID / TouchID on supported devices.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-white font-medium">Overseas Travel Mode</p>
                    <p className="text-sm text-gray-400">Enable card usage internationally without blocks.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}