// AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import Spinner from "../components/common/Spinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserExist = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      checkUserExist();
    }, [500]);
  }, []);

  const logout = () => {
    const accessToken = localStorage.removeItem("accessToken");
    setAuthenticated(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        logout,
        setActiveMeeting,
        activeMeeting,
      }}
    >
      {loading ? (
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <Spinner size="large" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
