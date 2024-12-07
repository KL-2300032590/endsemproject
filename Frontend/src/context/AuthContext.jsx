import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { getToken, removeToken, removeUser } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = getToken();
        if (token) {
          const response = await axiosInstance.get('/api/auth/verify');
          const roleResponse = await axiosInstance.get('/api/auth/check-role');
          setUser({ 
            ...response.data,
            role: roleResponse.data.role 
          });
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        removeToken();
        removeUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 