import React, { useContext, useEffect, useState, ReactNode } from "react";
import auth from "@react-native-firebase/auth";
import { getUserFromFirestore } from "../db";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  listenToBackgroundNotifications,
  listenToForegroundNotifications,
  requestUserPermission,
} from "../notification";
import { useColorScheme } from "react-native";

interface CurrentUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  name: string | null;
  createdAt: string;
}

interface AuthContextValue {
  currentUser: CurrentUser | null;
  userFromDB: any;
  userLoggedIn: boolean | null;
  loading: boolean;
  updateCurrentUser: (updates: Partial<CurrentUser>) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  registrationData: any;
  setRegistrationData: (updates: {}) => void;
  setUserFromDB: any;
  refreshUserData: (uid: string) => Promise<void>;
  confirmation: any | null;
  setConfirmation: (confirmation: any) => void;
  isDarkMode: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [userFromDB, setUserFromDB] = useState<any>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [registrationData, setRegistrationData] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const scheme = useColorScheme();

  useEffect(() => {
    if (scheme == "light") {
      setIsDarkMode(false);
    } else setIsDarkMode(true);
  }, [scheme]);

  useEffect(() => {
    requestUserPermission(userFromDB?.uid);
    listenToForegroundNotifications();
    listenToBackgroundNotifications();
  }, [userFromDB]);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      console.log("📌 onAuthStateChanged: ", user);
      initializeUser(user);
    });

    const unsubscribeToken = auth().onIdTokenChanged((user) => {
      console.log("🔄 onIdTokenChanged: ", user);
      initializeUser(user);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeToken();
    };
  }, []);

  async function initializeUser(user: any) {
    if (user) {
      console.log("user==>>", user);

      setCurrentUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        name: user.displayName,
        createdAt: user.metadata.creationTime || new Date().toISOString(),
      });
      setUserLoggedIn(true);
      try {
        setLoading(true);
        const data = await retryGetUserFromFirestore(user.uid);
        if (data) {
          setUserFromDB(data);
        } else {
          console.log("User not found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("🚨 Користувач вийшов із системи або не знайдений.");
      setUserLoggedIn(false);
      setCurrentUser(null);
      setUserFromDB(null);
    }
    setLoading(false);
  }

  async function retryGetUserFromFirestore(
    uid: string,
    retries = 5,
    delay = 1000
  ) {
    for (let i = 0; i < retries; i++) {
      try {
        const userData = await getUserFromFirestore(uid);
        if (userData) return userData;
      } catch (error) {}
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  async function refreshUserData(uid: string) {
    try {
      setLoading(true);
      const data = await getUserFromFirestore(uid);
      if (data) {
        setUserFromDB(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }
  function updateCurrentUser(updates: Partial<CurrentUser>) {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
  }
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "646053508010-sagihr8eeencqgju3nrrohmailo8uv1f.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const value: AuthContextValue = {
    currentUser,
    userFromDB,
    userLoggedIn,
    setLoading,
    loading,
    updateCurrentUser,
    registrationData,
    setRegistrationData,
    setUserFromDB,
    refreshUserData,
    confirmation,
    setConfirmation,
    isDarkMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
