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
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e6cc80] via-[#cca858] to-[#997a3d] p-[1px] shadow-lg shadow-[#cca858]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-gradient-to-br from-[#1a1a20] to-[#121217]">
              <span className="font-serif text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#e6cc80] to-[#cca858]">GL</span>
            </div>
          </div>
          <span className="text-xl font-light tracking-wider">GoldLink<span className="font-medium text-[#cca858]">Bank</span></span>
        </div>
        
        <div className="px-4 py-2">
          <div className="bg-[#0a0a0c] rounded-xl p-4 border border-[#27272a] flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-800 border-2 border-[#cca858] overflow-hidden">
              <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullName || user?.name || 'Valued Client'}</p>
              <p className="text-xs text-[#cca858] truncate uppercase tracking-widest">{user?.tierName || user?.tier || 'Private Wealth'}</p>
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
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#e6cc80] via-[#cca858] to-[#997a3d] p-[1px] shadow-sm shadow-[#cca858]/20">
              <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-gradient-to-br from-[#1a1a20] to-[#121217]">
                <span className="font-serif text-sm font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#e6cc80] to-[#cca858]">GL</span>
              </div>
            </div>
            <span className="text-lg font-light tracking-wider">GoldLink</span>
          </div>
          <div className="h-8 w-8 rounded-full border border-[#cca858] overflow-hidden cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay (For items not in bottom nav) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-sm pt-16 flex flex-col">
          <div className="p-4 border-b border-[#27272a] flex justify-between items-center bg-[#121217]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full border-2 border-[#cca858] overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-base font-medium text-white">{user?.fullName || user?.name || 'Valued Client'}</p>
                <p className="text-sm text-[#cca858] uppercase tracking-widest">{user?.tierName || user?.tier || 'Private Wealth'}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-6 w-6 text-gray-400" />
            </Button>
          </div>
          <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
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
          </nav>
          <div className="p-6 border-t border-[#27272a] bg-[#121217]">
            <Button
              variant="ghost"
              className="w-full justify-start py-6 text-base text-gray-400 hover:text-white hover:bg-[#1a1a20]"
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
            >
              <LogOut className="h-6 w-6 mr-3 text-red-500" />
              <span className="text-red-500">Secure Logout</span>
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0a0a0c] pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#121217]/90 backdrop-blur-md border-t border-[#27272a] z-40 pb-safe">
        <div className="flex justify-around items-center px-2 py-2">
          {[
            { name: 'Home', href: '/dashboard', icon: Home },
            { name: 'Accounts', href: '/accounts', icon: Wallet },
            { name: 'Transfers', href: '/transfers', icon: Send },
            { name: 'Cards', href: '/cards', icon: CreditCard },
          ].map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center w-16 p-2 rounded-lg transition-colors ${
                  isActive ? 'text-[#cca858]' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center w-16 p-2 rounded-lg transition-colors text-gray-500 hover:text-gray-300"
          >
            <Menu className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </nav>
    </div>
  );
}