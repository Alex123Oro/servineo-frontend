"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { verificarSesionBackend, User } from "../services/conexionBackend";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to restore user optimistically from localStorage so UI updates immediately
    try {
      const userRaw = localStorage.getItem("servineo_user");
      
    } catch (e) {
      console.error("Error parseando servineo_user desde localStorage:", e);
      localStorage.removeItem("servineo_user");
    }

    const token = localStorage.getItem("servineo_token");

    if (!token) {
      setLoading(false);
      return;
    }

    verificarSesionBackend(token)
      .then((data) => {
        if (data.valid) {
          if (data.user) setUser(data.user);
        } else {
          localStorage.removeItem("servineo_token");
          localStorage.removeItem("servineo_user");
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem("servineo_token");
        localStorage.removeItem("servineo_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem("servineo_token");
    localStorage.removeItem("servineo_user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
