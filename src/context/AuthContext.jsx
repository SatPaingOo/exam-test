import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, setToken, removeToken } from "src/services/localStorage";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const isAuthEnabled = import.meta.env.VITE_ALLOW_AUTH === "true";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = getToken();
    if (token) {
      // In a real app, you might validate the token with the server
      // For now, we'll store user data in localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        // If we have a token but no user data, clear the token
        removeToken();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setToken(userData.username);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    try {
      // Log logout action (fire-and-forget)
      (async () => {
        try {
          const { logSuccess } = await import("src/utils/logger");
          const { getUuid } = await import("src/services/localStorage");
          const visitorUuid = getUuid();
          if (user && user.id) {
            logSuccess(
              "User logged out",
              {},
              {
                action: "logout",
                actor_type: "user",
                actor_id: user.id,
                user_id: user.id,
                metadata: { username: user.username },
              }
            );
          } else {
            logSuccess(
              "Visitor logged out",
              {},
              {
                action: "logout",
                actor_type: "visitor",
                metadata: {},
                visitor_uuid: visitorUuid,
              }
            );
          }
        } catch (e) {
          console.error("Failed to log logout action:", e);
        }
      })();
    } catch (e) {
      // non-fatal
    }

    removeToken();
    setUser(null);
    // Clear any cached data
    localStorage.removeItem("user");
    // Redirect to home
    window.location.href = "/exam-test/";
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isAuthEnabled,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
