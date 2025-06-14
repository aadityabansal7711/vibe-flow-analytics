
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
  spotify_token_expires_at?: string;
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
  getValidSpotifyToken: () => Promise<string | null>;
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

  const SPOTIFY_CLIENT_ID = 'fe34af0e9c494464a7a8ba2012f382bb';
  const SPOTIFY_REDIRECT_URI = 'https://my-vibe-lytics.lovable.app/spotify-callback';

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔄 Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user && mounted) {
          try {
            console.log('👤 Fetching profile for user:', session.user.id);
            
            // Try to fetch existing profile first
            const { data: existingProfile, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (fetchError) {
              console.error('❌ Error fetching profile:', fetchError);
            }

            if (existingProfile) {
              console.log('✅ Found existing profile:', existingProfile);
              setProfile(existingProfile);
            } else {
              // Create new profile if none exists
              console.log('📝 Creating new profile for user:', session.user.id);
              const newProfileData = {
                user_id: session.user.id,
                email: session.user.email!,
                full_name: session.user.user_metadata?.full_name || null,
                plan_tier: 'free',
                has_active_subscription: false,
                plan_id: 'free_tier',
                spotify_connected: false
              };

              const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert(newProfileData)
                .select()
                .single();

              if (insertError) {
                console.error('❌ Error creating profile:', insertError);
                // Try to fetch again in case it was created by trigger
                const { data: retryProfile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('user_id', session.user.id)
                  .maybeSingle();
                
                if (retryProfile) {
                  console.log('✅ Found profile after retry:', retryProfile);
                  setProfile(retryProfile);
                }
              } else if (newProfile) {
                console.log('✅ Created new profile:', newProfile);
                setProfile(newProfile);
              }
            }
          } catch (err) {
            console.error('❌ Profile operation error:', err);
          }
        } else {
          setProfile(null);
        }

        if (mounted) setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (!session) setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error getting initial session:', error);
        if (mounted) setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('📝 Attempting signup for:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { full_name: fullName } : undefined,
        emailRedirectTo: 'https://my-vibe-lytics.lovable.app/'
      }
    });
    
    console.log('📝 Signup result:', { data, error });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Attempting signin for:', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('🔑 Signin result:', { error });
    return { error };
  };

  const signOut = async () => {
    try {
      console.log('👋 Signing out user...');
      
      // Clear localStorage
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('admin_email');
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      localStorage.removeItem('myvibelytics_user');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error signing out:', error);
      } else {
        console.log('✅ Supabase signout successful');
      }
      
      // Clear state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Force navigation to home
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Logout error:', error);
      window.location.href = '/';
    }
  };

  const connectSpotify = () => {
    if (!user) {
      console.error('❌ User must be logged in to connect Spotify');
      return;
    }

    console.log('🎵 Initiating Spotify OAuth...');
    
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'user-read-currently-playing',
      'playlist-read-private',
      'playlist-read-collaborative'
    ].join(' ');

    // Clear any existing Spotify data
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');

    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${SPOTIFY_CLIENT_ID}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=${user.id}&` +
      `show_dialog=true&` +
      `t=${Date.now()}`;

    console.log('🔗 Redirecting to Spotify auth URL');
    window.location.href = authUrl;
  };

  const getValidSpotifyToken = async (): Promise<string | null> => {
    if (!profile?.spotify_access_token) {
      console.log('❌ No Spotify access token available');
      return null;
    }

    // Check if token is expired
    if (profile.spotify_token_expires_at) {
      const expiresAt = new Date(profile.spotify_token_expires_at);
      const now = new Date();
      const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

      if (now.getTime() + bufferTime >= expiresAt.getTime()) {
        console.log('🔄 Token expired or expiring soon, refreshing...');
        return await refreshSpotifyToken();
      }
    }

    return profile.spotify_access_token;
  };

  const refreshSpotifyToken = async (): Promise<string | null> => {
    if (!profile?.spotify_refresh_token) {
      console.error('❌ No refresh token available');
      return null;
    }

    try {
      console.log('🔄 Refreshing Spotify token...');
      
      const { data, error } = await supabase.functions.invoke('spotify-refresh', {
        body: { refresh_token: profile.spotify_refresh_token }
      });

      if (error) {
        console.error('❌ Token refresh failed:', error);
        
        // If refresh fails, clear connection
        await updateProfile({
          spotify_connected: false,
          spotify_access_token: null,
          spotify_refresh_token: null,
          spotify_token_expires_at: null
        });
        
        throw new Error('Token refresh failed - please reconnect Spotify');
      }

      console.log('✅ Token refreshed successfully');
      
      const expiresAt = new Date(Date.now() + (data.expires_in * 1000));
      
      const updates: Partial<Profile> = {
        spotify_access_token: data.access_token,
        spotify_token_expires_at: expiresAt.toISOString()
      };

      if (data.refresh_token) {
        updates.spotify_refresh_token = data.refresh_token;
      }

      await updateProfile(updates);
      
      return data.access_token;
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      return null;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      console.error('❌ No user found for profile update');
      throw new Error('No user found for profile update');
    }

    console.log('🔄 Updating profile for user:', user.id, updates);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Error updating profile:', error);
        throw error;
      }

      if (data) {
        setProfile(data);
        console.log('✅ Profile updated successfully:', data);
      }
    } catch (error) {
      console.error('❌ Update profile error:', error);
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
    updateProfile,
    getValidSpotifyToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
