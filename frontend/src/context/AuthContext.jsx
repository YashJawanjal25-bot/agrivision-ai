import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase/config";

const AuthContext = createContext(null);

const DEMO_USER_SESSION_KEY = "agrivision_demo_user";
const DEMO_REGISTRY_KEY = "agrivision_demo_registry"; // all registered demo accounts

/** Read registered demo accounts from localStorage */
function getDemoRegistry() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_REGISTRY_KEY) || "[]");
  } catch {
    return [];
  }
}

/** Save a demo account into the registry (upsert by email) */
function upsertDemoRegistry(user) {
  try {
    const registry = getDemoRegistry();
    const existing = registry.findIndex((u) => u.email === user.email);
    const entry = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      registeredAt: user.registeredAt || new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    if (existing >= 0) {
      registry[existing] = { ...registry[existing], ...entry };
    } else {
      registry.push(entry);
    }
    localStorage.setItem(DEMO_REGISTRY_KEY, JSON.stringify(registry));
  } catch (err) {
    console.error("Failed to update demo registry:", err);
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      // Real Firebase auth state listener
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName:
              currentUser.displayName ||
              currentUser.email?.split("@")[0] ||
              "Farmer / Agronomist",
            isDemo: false,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Demo Mode: restore session from localStorage
      try {
        const savedDemoUser = localStorage.getItem(DEMO_USER_SESSION_KEY);
        if (savedDemoUser) {
          setUser(JSON.parse(savedDemoUser));
        }
      } catch (err) {
        console.error("Failed to read demo session:", err);
      }
      setLoading(false);
    }
  }, []);

  const formatAuthError = (error) => {
    if (!error) return "An unknown error occurred.";
    const code = error.code || "";
    switch (code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists. Please log in instead.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/operation-not-allowed":
        return "Email/Password sign-in is not enabled in your Firebase console.";
      case "auth/weak-password":
        return "Password is too weak. Please use at least 6 characters.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect email or password. Please try again.";
      case "auth/too-many-requests":
        return "Too many unsuccessful attempts. Please wait a moment and try again.";
      default:
        return (
          error.message || "Failed to authenticate. Please check your credentials."
        );
    }
  };

  /** Sign Up */
  const signup = async (email, password, displayName = "") => {
    setAuthError(null);

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (displayName && userCredential.user) {
          await updateProfile(userCredential.user, { displayName });
          setUser((prev) => ({ ...prev, displayName }));
        }
        return userCredential.user;
      } catch (error) {
        const msg = formatAuthError(error);
        setAuthError(msg);
        throw new Error(msg);
      }
    } else {
      // Demo Mode: check if email already registered
      const registry = getDemoRegistry();
      if (registry.find((u) => u.email === email.trim())) {
        const msg = "An account with this email already exists. Please log in instead.";
        setAuthError(msg);
        throw new Error(msg);
      }

      const mockUser = {
        uid: "demo-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        email: email.trim(),
        displayName:
          displayName.trim() || email.split("@")[0] || "Farmer Agronomist",
        isDemo: true,
        registeredAt: new Date().toISOString(),
      };

      upsertDemoRegistry(mockUser);
      localStorage.setItem(DEMO_USER_SESSION_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  /** Login */
  const login = async (email, password) => {
    setAuthError(null);

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (error) {
        const msg = formatAuthError(error);
        setAuthError(msg);
        throw new Error(msg);
      }
    } else {
      // Demo Mode: look up the account by email
      const registry = getDemoRegistry();
      const existing = registry.find((u) => u.email === email.trim());

      // If account doesn't exist yet, auto-create it (first-time convenience)
      const mockUser = existing
        ? {
            uid: existing.uid,
            email: existing.email,
            displayName: existing.displayName,
            isDemo: true,
            registeredAt: existing.registeredAt,
          }
        : {
            uid: "demo-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
            email: email.trim(),
            displayName: email.split("@")[0] || "Farmer Agronomist",
            isDemo: true,
            registeredAt: new Date().toISOString(),
          };

      upsertDemoRegistry(mockUser);
      localStorage.setItem(DEMO_USER_SESSION_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  /** Logout */
  const logout = async () => {
    setAuthError(null);
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
        setUser(null);
      } catch (error) {
        const msg = formatAuthError(error);
        setAuthError(msg);
        throw new Error(msg);
      }
    } else {
      localStorage.removeItem(DEMO_USER_SESSION_KEY);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    authError,
    setAuthError,
    isFirebaseConfigured,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/** Helper: get all registered demo users (for admin view) */
export function getDemoUsers() {
  return getDemoRegistry();
}
