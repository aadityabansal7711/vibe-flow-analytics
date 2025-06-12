
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  plan_tier?: string;
  has_active_subscription?: boolean;
  plan_id?: string;
  spotify_connected?: boolean;
  spotify_user_id?: string;
  spotify_display_name?: string;
  spotify_avatar_url?: string;
  spotify_access_token?: string;
  spotify_refresh_token?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isUnlocked: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  connectSpotify: () => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const isUnlocked = profile?.has_active_subscription || false;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            // First try to get existing profile
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (error) {
              console.error('Error fetching profile:', error);
            }

            if (!profileData) {
              console.log('No profile found, creating new one...');
              // Create new profile if it doesn't exist
              const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([{ 
                  user_id: session.user.id, 
                  email: session.user.email!,
                  full_name: session.user.user_metadata?.full_name || null,
                  plan_tier: 'free',
                  has_active_subscription: false,
                  spotify_connected: false
                }])
                .select()
                .single();

              if (insertError) {
                console.error('Failed to create profile:', insertError);
              } else {
                setProfile(newProfile);
              }
            } else {
              setProfile(profileData);
            }
          } catch (err) {
            console.error('Profile operation error:', err);
          }
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('Attempting signup for:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { full_name: fullName } : undefined
      }
    });
    
    console.log('Signup result:', { data, error });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting signin for:', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('Signin result:', { error });
    return { error };
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      
      // Clear any admin session
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('admin_email');
      
      // Clear Spotify tokens
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      localStorage.removeItem('myvibelytics_user');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        console.log('Supabase signout successful');
      }
      
      // Clear state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      console.log('Logout complete, redirecting to home');
      
      // Force navigation to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force reload even if there's an error
      window.location.href = '/';
    }
  };

  const connectSpotify = () => {
    if (!user) {
      console.error('User must be logged in to connect Spotify');
      return;
    }

    const clientId = 'fe34af0e9c494464a7a8ba2012f382bb';
    const redirectUri = 'https://vibe-flow-analytics.lovable.app/spotify-callback';
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'user-read-currently-playing',
      'playlist-read-private',
      'playlist-read-collaborative'
    ].join(' ');

    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=${user.id}`;

    console.log('Redirecting to Spotify auth:', authUrl);
    window.location.href = authUrl;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      console.error('No user found for profile update');
      return;
    }

    console.log('Updating profile for user:', user.id, updates);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      setProfile(data);
      console.log('Profile updated successfully:', data);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isUnlocked,
    signUp,
    signIn,
    signOut,
    connectSpotify,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
