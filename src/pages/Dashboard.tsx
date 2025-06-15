import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import useSpotifyData from '@/hooks/useSpotifyData';
import DashboardHeader from './dashboard/components/DashboardHeader';
import DashboardFeatureGrid from './dashboard/components/DashboardFeatureGrid';
import SpotifyConnect from '@/components/SpotifyConnect';

const Dashboard = () => {
  const { user, profile, signOut, isUnlocked, loading: authLoading } = useAuth();
  const { topTracks, topArtists, recentlyPlayed, loading: spotifyLoading, error } = useSpotifyData();

  // Show loading while authentication is being resolved
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // Redirect to auth if no user
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading if we have user but no profile yet
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-white text-lg">Setting up your profile...</div>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const monthlyData = [
    { month: 'Jan', hours: 45 },
    { month: 'Feb', hours: 52 },
    { month: 'Mar', hours: 38 },
    { month: 'Apr', hours: 61 },
    { month: 'May', hours: 55 },
    { month: 'Jun', hours: 67 }
  ];

  const genreData = [
    { name: 'Pop', value: 35, color: '#FF6B6B' },
    { name: 'Rock', value: 25, color: '#4ECDC4' },
    { name: 'Hip Hop', value: 20, color: '#45B7D1' },
    { name: 'Electronic', value: 12, color: '#96CEB4' },
    { name: 'Jazz', value: 8, color: '#FFEAA7' }
  ];

  const timeData = [
    { hour: '6AM', plays: 5 },
    { hour: '9AM', plays: 15 },
    { hour: '12PM', plays: 25 },
    { hour: '3PM', plays: 20 },
    { hour: '6PM', plays: 35 },
    { hour: '9PM', plays: 45 },
    { hour: '12AM', plays: 30 }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <DashboardHeader profile={profile} user={user} isUnlocked={isUnlocked} signOut={signOut} />
      {profile && !profile.spotify_connected && (
        // Show SpotifyConnect - passes through unmodified
        <div className="mb-8">
          <SpotifyConnect />
        </div>
      )}
      <DashboardFeatureGrid
        profile={profile}
        user={user}
        isUnlocked={isUnlocked}
        topTracks={topTracks}
        topArtists={topArtists}
        recentlyPlayed={recentlyPlayed}
        spotifyLoading={spotifyLoading}
        error={error}
        monthlyData={monthlyData}
        genreData={genreData}
        timeData={timeData}
      />
    </div>
  );
};

export default Dashboard;
