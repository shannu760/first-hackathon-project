import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { saveLoginInfoToFirebase } from '../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await api.getMe();
      if (data.success && data.user) {
        setUser(data.user);
        setProfile(data.profile);
        saveLoginInfoToFirebase(data.user, data.profile);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await api.login(credentials);
    if (data.success && data.user) {
      setUser(data.user);
      setProfile(data.profile);
      saveLoginInfoToFirebase(data.user, data.profile);
    }
    return data;
  };

  const signup = async (userData) => {
    const data = await api.signup(userData);
    if (data.success && data.user) {
      setUser(data.user);
      saveLoginInfoToFirebase(data.user, null);
    }
    return data;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout request completed with warning:', err);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const data = await api.getProfile();
      if (data.success) {
        setProfile(data.profile);
        if (user && data.profile) {
          saveLoginInfoToFirebase(user, data.profile);
        }
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, login, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
