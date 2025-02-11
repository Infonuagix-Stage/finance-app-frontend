// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Création du contexte
const AuthContext = createContext();

// Fournisseur du contexte
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  // Dès que le token change, on peut essayer d'extraire les infos utilisateur
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Token décodé :", decoded); // Ajoutez ce log pour inspecter le payload

        // Vérifiez ici que le token contient bien une propriété "id"
        setUser({
          id: decoded.id, // Assurez-vous que 'decoded.id' existe
          email: decoded.sub,
          name: decoded.name, // 'sub' est souvent utilisé pour l'email ou l'identifiant principal
          // Ajoutez d'autres propriétés si nécessaire
        });
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  // Fonction pour gérer la connexion (mise à jour du token)
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // Fonction pour se déconnecter
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte plus facilement dans vos composants
export const useAuthContext = () => {
  return useContext(AuthContext);
};
