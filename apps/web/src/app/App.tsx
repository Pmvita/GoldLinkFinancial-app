import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AnimatePresence } from 'motion/react';
import type { User } from '@goldlink/core';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Transfers from './components/Transfers';
import BillPay from './components/BillPay';
import MobileDeposit from './components/MobileDeposit';
import Cards from './components/Cards';
import Budgeting from './components/Budgeting';
import Settings from './components/Settings';
import AccountDetail from './components/AccountDetail';
import { SplashScreen } from './components/SplashScreen';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('bankingSession');
    if (session) {
      const parsed = JSON.parse(session) as { user: User };
      setIsAuthenticated(true);
      setUser(parsed.user);
    }
  }, []);

  const handleLogin = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('bankingSession', JSON.stringify({ user: userData }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('bankingSession');
  };

  return (
    <>
      <AnimatePresence>
        {isBooting && <SplashScreen key="splash" onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>

      {!isBooting && (
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated && user ? (
                  <Dashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/accounts"
              element={
                isAuthenticated && user ? (
                  <Accounts user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/accounts/:accountId"
              element={
                isAuthenticated && user ? (
                  <AccountDetail user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/transfers"
              element={
                isAuthenticated && user ? (
                  <Transfers user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/billpay"
              element={
                isAuthenticated && user ? (
                  <BillPay user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/deposit"
              element={
                isAuthenticated && user ? (
                  <MobileDeposit user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/cards"
              element={
                isAuthenticated && user ? (
                  <Cards user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/budgeting"
              element={
                isAuthenticated && user ? (
                  <Budgeting user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/settings"
              element={
                isAuthenticated && user ? (
                  <Settings user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}
