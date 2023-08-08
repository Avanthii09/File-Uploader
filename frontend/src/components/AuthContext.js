import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate here

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate(); // Use useNavigate here

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setUserRole("");
    navigate("/"); // Use the navigate function here

    // You can also redirect from here using 'useNavigate' if needed
    // Example: navigate("/");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
