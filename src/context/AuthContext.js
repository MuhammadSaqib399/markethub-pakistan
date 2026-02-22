"use client";

/**
 * Auth Context
 * Global authentication state management using React Context
 * Persists login state via localStorage token
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("markethub_token");
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await authAPI.getMe();
      setUser(data.user);
    } catch {
      // Token invalid or expired - clear it
      localStorage.removeItem("markethub_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login handler
  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    localStorage.setItem("markethub_token", data.token);
    setUser(data.user);
    return data;
  };

  // Register handler
  const register = async (userData) => {
    const data = await authAPI.register(userData);
    localStorage.setItem("markethub_token", data.token);
    setUser(data.user);
    return data;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("markethub_token");
    setUser(null);
  };

  // Update user in context (after profile update)
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
