import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Transfers from './components/Transfers';
import BillPay from './components/BillPay';
import MobileDeposit from './components/MobileDeposit';
import Cards from './components/Cards';
import Budgeting from './components/Budgeting';
import Settings from './components/Settings';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem('bankingSession');
    if (session) {
      const parsed = JSON.parse(session);
      setIsAuthenticated(true);
      setUser(parsed.user);
    }
  }, []);

  const handleLogin = (userData) => {
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
            isAuthenticated ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/accounts"
          element={
            isAuthenticated ? (
              <Accounts user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/transfers"
          element={
            isAuthenticated ? (
              <Transfers user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/billpay"
          element={
            isAuthenticated ? (
              <BillPay user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/deposit"
          element={
            isAuthenticated ? (
              <MobileDeposit user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/cards"
          element={
            isAuthenticated ? (
              <Cards user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/budgeting"
          element={
            isAuthenticated ? (
              <Budgeting user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <Settings user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
