import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { APP_CONFIG, isAdminEmail } from '../config/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles_pa2024')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create profile if it doesn't exist
        await createProfile(userId);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const createProfile = async (userId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email;
      const isAdmin = isAdminEmail(userEmail);

      const { data, error } = await supabase
        .from('profiles_pa2024')
        .insert([
          {
            id: userId,
            email: userEmail,
            name: user?.user_metadata?.name || userEmail,
            plan: isAdmin ? 'enterprise' : 'free',
            scan_count: 0,
            scan_limit: isAdmin ? null : 3,
            role: isAdmin ? 'admin' : 'user'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return;
      }
      setProfile(data);
    } catch (error) {
      console.error('Error in createProfile:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user: user ? {
      ...user,
      ...profile,
      name: profile?.name || user?.user_metadata?.name || user?.email,
      plan: profile?.plan || 'free',
      scanCount: profile?.scan_count || 0,
      scanLimit: profile?.scan_limit || 3,
      role: profile?.role || 'user',
      isAdmin: profile?.role === 'admin'
    } : null,
    loading,
    signUp,
    signIn,
    signOut,
    profile,
    refreshProfile: () => user && fetchProfile(user.id)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};