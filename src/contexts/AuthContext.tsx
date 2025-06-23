
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  user_id: string;
  id: string;
  email: string;
  full_name?: string;
  spotify_connected?: boolean;
  spotify_access_token?: string;
  spotify_refresh_token?: string;
  spotify_user_id?: string;
  spotify_display_name?: string;
  spotify_avatar_url?: string;
  spotify_token_expires_at?: string;
  has_active_subscription?: boolean;
  plan_tier?: string;
  plan_id?: string;
  plan_start_date?: string;
  plan_end_date?: string;
  profile_picture_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface CustomPricing {
  id: string;
  user_id: string;
  email: string;
  custom_price: number;
  currency: string;
  discount_percentage?: number;
  reason?: string;
  valid_until?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  granted_by?: string;
  granted_at: string;
  expires_at?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  customPricing: CustomPricing | null;
  userRole: UserRole | null;
  loading: boolean;
  isUnlocked: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  connectSpotify: () => void;
  disconnectSpotify: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  getCustomPrice: () => number;
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
  const [customPricing, setCustomPricing] = useState<CustomPricing | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const isUnlocked = profile?.has_active_subscription || false;
  const isAdmin = userRole?.role === 'admin';

  const fetchProfile = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
      }

      // Fetch custom pricing
      const { data: pricingData, error: pricingError } = await supabase
        .from('custom_pricing')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (pricingError) {
        console.error('Error fetching custom pricing:', pricingError);
      } else {
        setCustomPricing(pricingData);
      }

      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
      } else {
        setUserRole(roleData);
      }

      // Log user activity
      await supabase.rpc('log_user_activity', {
        activity_type: 'profile_fetch',
        activity_data: { timestamp: new Date().toISOString() }
      });

    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const getCustomPrice = () => {
    if (customPricing && customPricing.is_active) {
      const now = new Date();
      const validUntil = customPricing.valid_until ? new Date(customPricing.valid_until) : null;
      
      if (!validUntil || now <= validUntil) {
        return customPricing.custom_price;
      }
    }
    return 99900; // Default price in paise (₹999)
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile();
          }, 0);
        } else {
          setProfile(null);
          setCustomPricing(null);
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (!error) {
        await supabase.rpc('log_user_activity', {
          activity_type: 'signup_attempt',
          activity_data: { email, timestamp: new Date().toISOString() }
        });
      }

      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        await supabase.rpc('log_user_activity', {
          activity_type: 'login',
          activity_data: { email, timestamp: new Date().toISOString() }
        });
      }

      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        await supabase.rpc('log_user_activity', {
          activity_type: 'logout',
          activity_data: { timestamp: new Date().toISOString() }
        });
      }
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const connectSpotify = () => {
    const clientId = 'your-spotify-client-id';
    const redirectUri = `${window.location.origin}/spotify-callback`;
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'playlist-modify-public',
      'playlist-modify-private'
    ].join(' ');

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${user?.id}`;

    window.location.href = spotifyAuthUrl;
  };

  const disconnectSpotify = async () => {
    if (!user || !profile) return;

    // Check if user has active subscription
    if (profile.has_active_subscription) {
      toast.error('Premium users cannot disconnect Spotify to ensure continuous access to advanced features.');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          spotify_connected: false,
          spotify_access_token: null,
          spotify_refresh_token: null,
          spotify_user_id: null,
          spotify_display_name: null,
          spotify_avatar_url: null,
          spotify_token_expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await supabase.rpc('log_user_activity', {
        activity_type: 'spotify_disconnect',
        activity_data: { timestamp: new Date().toISOString() }
      });

      await fetchProfile();
      toast.success('Spotify disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting Spotify:', error);
      toast.error('Failed to disconnect Spotify');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await supabase.rpc('log_user_activity', {
        activity_type: 'profile_update',
        activity_data: { updates, timestamp: new Date().toISOString() }
      });

      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    customPricing,
    userRole,
    loading,
    isUnlocked,
    isAdmin,
    signUp,
    signIn,
    signOut,
    connectSpotify,
    disconnectSpotify,
    updateProfile,
    fetchProfile,
    getCustomPrice,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
