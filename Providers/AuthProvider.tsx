// AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the context type
interface AuthContextType {
  user: any;
  isLoading: boolean;
  updateUser: (newUserData: any) => void;
  logout: () => void;
  updateRawEmail: (email: string) => void;
  rawEmail: string;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rawEmail, setRawEmail] = useState("");

  useEffect(() => {
    // Load user data from AsyncStorage on app startup
    loadUser();
    loadRawEmail();
  }, []);

  // Function to load user data from AsyncStorage
  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRawEmail = async () => {
    try {
      const userData = await AsyncStorage.getItem("rawEmail");
      if (userData) {
        setRawEmail(userData);
      }
    } catch (error) {
      console.error("Error loading raw email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update user data and save it to AsyncStorage
  const updateUser = async (newUserData: any) => {
    setUser(newUserData);
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(newUserData));
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };
  // Function to update user data and save it to AsyncStorage
  const updateRawEmail = async (email: any) => {
    setRawEmail(email);
    try {
      await AsyncStorage.setItem("rawEmail", email);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  // Function to remove user data from AsyncStorage (logout)
  const logout = async () => {
    setUser(null);
    setRawEmail("");
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error removing user data:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, updateUser, logout, rawEmail, updateRawEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
