import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Pricing from '@/pages/Pricing';
import ForgotPassword from '@/pages/ForgotPassword';
import AdminLogin from '@/pages/AdminLogin';
import Admin from '@/pages/Admin';
import Community from "@/pages/Community";

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClient>
  );
}

export default App;
