/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any;
  userName: string | null;
  token: string | null;
  planId: any;
  planName: string | null;
  login: (token: string, user: any, planId: any, planName: string, userName: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean; 
}

const AuthContext = createContext<AuthContextType>(null!);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [planId, setPlanId] = useState<any>(null);
  const [planName, setPlanName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedPlanId = localStorage.getItem('plan_id');
    const storedPlanName = localStorage.getItem('plan_name');
    const storedUserName = localStorage.getItem('user_name');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setPlanId(storedPlanId);
      setPlanName(storedPlanName);
      setUserName(storedUserName);
    }
    setLoading(false); 
  }, []);

  const login = (newToken: string, newUser: any, newPlanId: any, newPlanName: string, newUserName: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('user_name', newUserName);
    localStorage.setItem('plan_id', newPlanId);
    localStorage.setItem('plan_name', newPlanName);
    setToken(newToken);
    setUser(newUser);
    setPlanId(newPlanId);
    setPlanName(newPlanName)
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_name');
    localStorage.removeItem('plan_id');
    localStorage.removeItem('plan_name');
    setToken(null);
    setUser(null);
    setUserName(null);
    setPlanId(null);        // <--- ESSENCIAL
    setPlanName(null);      // <--- ESSENCIAL
  };

  const value = {
    user,
    userName,
    token,
    planId,
    planName,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};