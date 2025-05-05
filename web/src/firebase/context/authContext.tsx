import React, { useContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "../config";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDoc, Timestamp } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { getUsers } from "../db";

interface CurrentUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  name: string | null;
  photo: string | null;
  createdAt: string;
}

interface AuthContextValue {
  currentUser: CurrentUser | null;
  userLoggedIn: boolean | null;
  userFromBD: CurrentUser | null;
  users: User[];
  loading: boolean;
  updateCurrentUser: (updates: Partial<CurrentUser>) => void;
  itemsPerPage: number;
  changePerPage: (number: number) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}
interface Referral {
  spent: number;
  id: string;
}

interface User {
  uid: string;
  displayName: string;
  referralStatusName?: string;
  referrals: Referral[];
  referralCode: string;
  createdAt: Timestamp;
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
  const [userFromBD, setUserFromBD] = useState<CurrentUser | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [users, setUsers] = useState<User[]>([]);
  const changePerPage = (item: number) => {
    setItemsPerPage(item);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);
  useEffect(() => {
    const fetchUserFromBD = async () => {
      if (currentUser?.uid) {
        const userDoc = await getDoc(doc(db, "usersAdmin", currentUser.uid));
        setUserFromBD(userDoc.data() as CurrentUser);
      }
    };
    fetchUserFromBD();
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsers(users as User[]);
    };
    fetchUsers();
  }, []);
  async function initializeUser(user: User | null) {
    if (user) {
      setCurrentUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        name: user.displayName,
        photo: user.photoURL || null,
        createdAt: new Date().toISOString(),
      });
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
      setCurrentUser(null);
    }
    setLoading(false);
  }

  function updateCurrentUser(updates: Partial<CurrentUser>) {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
  }

  const value: AuthContextValue = {
    currentUser,
    userLoggedIn,
    userFromBD,
    users,
    loading,
    updateCurrentUser,
    itemsPerPage,
    changePerPage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
