import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(localStorage.getItem("userEmail"));
  const [loading, setLoading] = useState(false);

  const login = (newToken, email) => { // Must accept two arguments
    localStorage.setItem("token", newToken);
    localStorage.setItem("userEmail", email);
    setToken(newToken);
    setUser(email);
  };

 const logout = () => {
    localStorage.removeItem("token"); 
    setToken(null); // Clear state
    window.location.href = "/"; 
  };
  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);