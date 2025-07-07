import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Mock auth check - replace with actual Clerk implementation
    const mockUser = {
      id: '1',
      email: 'carla@example.com',
      name: 'Carla Martinez',
      plan: 'pro',
      scanCount: 12,
      scanLimit: null,
      role: 'user'
    };
    setUser(mockUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - replace with Clerk
    setUser({
      id: '1',
      email,
      name: 'User',
      plan: 'free',
      scanCount: 0,
      scanLimit: 3,
      role: 'user'
    });
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};