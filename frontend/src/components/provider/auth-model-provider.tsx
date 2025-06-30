"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import UserLoginModal from "@/components/auth/UserLoginModal";
import UserSignupModal from "@/components/auth/UserSignupModal";

interface AuthModalContextType {
  openLogin: () => void;
  closeLogin: () => void;
  openSignup: () => void;
  closeSignup: () => void;
  isLoginOpen: boolean;
  isSignupOpen: boolean;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

interface AuthModalProviderProps {
  children: ReactNode;
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openLogin = () => {
    setIsSignupOpen(false); // Close signup if open
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  const openSignup = () => {
    setIsLoginOpen(false); // Close login if open
    setIsSignupOpen(true);
  };

  const closeSignup = () => {
    setIsSignupOpen(false);
  };

  const value: AuthModalContextType = {
    openLogin,
    closeLogin,
    openSignup,
    closeSignup,
    isLoginOpen,
    isSignupOpen,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <UserLoginModal isOpen={isLoginOpen} onClose={closeLogin} />
      <UserSignupModal isOpen={isSignupOpen} onClose={closeSignup} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
