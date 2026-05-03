import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import {
  Home,
  Wallet,
  Send,
  Receipt,
  Camera,
  CreditCard,
  PieChart,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children, user, onLogout }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Accounts', href: '/accounts', icon: Wallet },
    { name: 'Transfers', href: '/transfers', icon: Send },
    { name: 'Bill Pay', href: '/billpay', icon: Receipt },
    { name: 'Deposit', href: '/deposit', icon: Camera },
    { name: 'Cards', href: '/cards', icon: CreditCard },
    { name: 'Budgeting', href: '/budgeting', icon: PieChart },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold">GoldLink Bank</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.username}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => setMobileMenuOpen(false)}
              />
              <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold">GoldLink Bank</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <nav className="p-4 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </aside>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
