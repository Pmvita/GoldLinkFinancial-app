import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Bell, User, Lock, Smartphone, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings({ user, onLogout }) {
  const handleSave = (section) => {
    toast.success(`${section} settings updated successfully`);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="flex w-full flex-col sm:flex-row h-auto gap-2 bg-transparent p-0 mb-6">
            <TabsTrigger value="profile" className="w-full sm:flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm border rounded-lg py-3">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="w-full sm:flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm border rounded-lg py-3">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="w-full sm:flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm border rounded-lg py-3">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="w-full sm:flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm border rounded-lg py-3">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" defaultValue="Smith" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.smith@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Mailing Address</Label>
                  <Input id="address" defaultValue="123 Main St, Apt 4B" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" defaultValue="NY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" defaultValue="10001" />
                  </div>
                </div>
                <Button onClick={() => handleSave('Profile')}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button onClick={() => handleSave('Password')}>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-semibold">2FA is Enabled</div>
                      <div className="text-sm text-gray-600">Your account is protected</div>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-gray-500" />
                      <span>Authenticator App</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <span>Email Verification</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-gray-500" />
                      <span>SMS Verification</span>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Biometric Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fingerprint">Fingerprint Login</Label>
                  <Switch id="fingerprint" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="face-id">Face ID</Label>
                  <Switch id="face-id" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Current Session</div>
                      <div className="text-sm text-gray-500">
                        Chrome on MacOS • New York, NY
                      </div>
                      <div className="text-xs text-gray-400">
                        Active now
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Mobile App</div>
                      <div className="text-sm text-gray-500">
                        iPhone 15 • New York, NY
                      </div>
                      <div className="text-xs text-gray-400">
                        2 hours ago
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Revoke</Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Sign Out All Devices</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Transaction Alerts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="large-purchases">Large purchases ($500+)</Label>
                      <Switch id="large-purchases" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="all-purchases">All purchases</Label>
                      <Switch id="all-purchases" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="deposits">Deposits</Label>
                      <Switch id="deposits" defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Account Alerts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="low-balance">Low balance warnings</Label>
                      <Switch id="low-balance" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bill-reminders">Bill payment reminders</Label>
                      <Switch id="bill-reminders" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="budget-alerts">Budget limit alerts</Label>
                      <Switch id="budget-alerts" defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Security Alerts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-alerts">New login detected</Label>
                      <Switch id="login-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-changes">Password changes</Label>
                      <Switch id="password-changes" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="suspicious">Suspicious activity</Label>
                      <Switch id="suspicious" defaultChecked />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Notification')}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Data Sharing</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing">Marketing communications</Label>
                      <Switch id="marketing" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="analytics">Usage analytics</Label>
                      <Switch id="analytics" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="third-party">Third-party offers</Label>
                      <Switch id="third-party" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full">Download My Data</Button>
                  <Button variant="outline" className="w-full">Privacy Policy</Button>
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                    Close Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
