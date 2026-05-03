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
    { name: 'Wealth', href: '/budgeting', icon: PieChart },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#121217] border-r border-[#27272a] sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-[#cca858] to-[#e6cc80] flex items-center justify-center">
            <Shield className="h-5 w-5 text-[#121217]" />
          </div>
          <span className="text-xl font-light tracking-wider">GoldLink<span className="font-medium text-[#cca858]">Bank</span></span>
        </div>
        
        <div className="px-4 py-2">
          <div className="bg-[#0a0a0c] rounded-xl p-4 border border-[#27272a] flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-800 border-2 border-[#cca858] overflow-hidden">
              <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Valued Client'}</p>
              <p className="text-xs text-[#cca858] truncate uppercase tracking-widest">{user?.tier || 'Private Wealth'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#cca858]/10 text-[#cca858]'
                    : 'text-gray-400 hover:bg-[#1a1a20] hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-[#cca858]' : 'text-gray-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#27272a]">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#1a1a20]"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5 mr-3 text-gray-500" />
            Secure Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-[#121217] border-b border-[#27272a] sticky top-0 z-40">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#cca858] to-[#e6cc80] flex items-center justify-center">
              <Shield className="h-4 w-4 text-[#121217]" />
            </div>
            <span className="text-lg font-light tracking-wider">GoldLink</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-[#0a0a0c] pt-16">
          <div className="p-4 border-b border-[#27272a]">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full border-2 border-[#cca858] overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-base font-medium text-white">{user?.name || 'Valued Client'}</p>
                <p className="text-sm text-[#cca858] uppercase tracking-widest">{user?.tier || 'Private Wealth'}</p>
              </div>
            </div>
          </div>
          <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-[#cca858]/10 text-[#cca858]'
                      : 'text-gray-400 hover:bg-[#1a1a20] hover:text-white'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${isActive ? 'text-[#cca858]' : 'text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t border-[#27272a]">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-6 text-base text-gray-400 hover:text-white hover:bg-[#1a1a20]"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
              >
                <LogOut className="h-6 w-6 mr-3 text-gray-500" />
                Secure Logout
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0a0a0c]">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}