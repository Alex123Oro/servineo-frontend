"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { verificarSesionBackend, User } from "../../redux/services/services/registro";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const readUserFromStorage = () => {
    const storedUser = localStorage.getItem("servineo_user");
    try {
      if (storedUser && storedUser !== "undefined") {
        return JSON.parse(storedUser) as User;
      }
      return null;
    } catch {
      console.error("Usuario malformado en localStorage, reseteando");
      localStorage.removeItem("servineo_user");
      return null;
    }
  };

  useEffect(() => {
    try {
      setUser(readUserFromStorage());
    } catch (e) {
      console.error("Error leyendo usuario:", e);
      localStorage.removeItem("servineo_user");
    }

    const token = localStorage.getItem("servineo_token");
    if (!token) {
      setLoading(false);
      return;
    }

    verificarSesionBackend(token)
      .then((data) => {
        if (data.valid && data.user) {
          setUser((prev) => {
            const currentStored = readUserFromStorage();
            if (currentStored) {
              const storedName = currentStored.name || '';
              const backendName = data.user.name || '';
          
              if (storedName !== backendName) {
                console.log("🔄 localStorage tiene nombre diferente al backend:", {
                  localStorage: storedName,
                  backend: backendName,
                  usando: "localStorage (más reciente)"
                });
              }

              const userFromStorage: User = {
                id: currentStored.id,
                email: currentStored.email || '',
                name: currentStored.name,
                picture: currentStored.picture,
              };
              return userFromStorage;
            } else {
            
              localStorage.setItem("servineo_user", JSON.stringify(data.user));
              return data.user;
            }
          });
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

  useEffect(() => {
    const syncUser = () => {
      setUser(readUserFromStorage());
    };

    window.addEventListener("servineo_user_updated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("servineo_user_updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("servineo_token");
    localStorage.removeItem("servineo_user");
    setUser(null);
    router.push("/");
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

