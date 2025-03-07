import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Ajout de l'état de chargement

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Token décodé :", decoded);

        setUser({
          userId: decoded.userId,
          email: decoded.sub,
          name: decoded.name,
        });
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false); // Chargement terminé
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
