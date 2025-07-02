import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authAPI } from "../services/api";

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

import { AuthContext } from "./AuthContextDef";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchAndSetUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchAndSetUser = async (jwtToken: string) => {
    try {
      const res = await fetch("http://localhost:8000/users/me", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user info");
      const currentUser = await res.json();

      setUser({
        id: currentUser.id,
        email: currentUser.email,
        isAdmin: currentUser.is_admin,
      });
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    const { access_token } = response;
    localStorage.setItem("token", access_token);
    localStorage.setItem("userEmail", email);
    setToken(access_token);
    await fetchAndSetUser(access_token);
  };

  const register = async (email: string, password: string) => {
    await authAPI.register(email, password);
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
