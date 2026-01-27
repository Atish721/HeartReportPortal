import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("heart_report_token"));

  const login = (jwt) => {
    localStorage.setItem("heart_report_token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("heart_report_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
