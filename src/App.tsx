
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { SpotifyProvider } from '@/contexts/SpotifyContext';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Pricing from '@/pages/Pricing';
import ForgotPassword from '@/pages/ForgotPassword';
import AdminLogin from '@/pages/AdminLogin';
import Admin from '@/pages/Admin';
import Community from "@/pages/Community";
import Buy from "@/pages/Buy";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SpotifyProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </Router>
        </SpotifyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
