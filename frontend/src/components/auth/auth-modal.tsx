"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import UserLoginModal from "../auth/UserLoginModal";
import UserSignupModal from "../auth/UserSignupModal";

interface AuthModalContextType {
  openUserLogin: () => void;
  openUserSignup: () => void;
  closeModals: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}

interface AuthModalProviderProps {
  children: ReactNode;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (name: string, email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

export function AuthModalProvider({
  children,
  onLogin,
  onSignup,
  isLoading = false,
}: AuthModalProviderProps) {
  const [isUserLoginOpen, setIsUserLoginOpen] = useState(false);
  const [isUserSignupOpen, setIsUserSignupOpen] = useState(false);

  const openUserLogin = () => {
    setIsUserSignupOpen(false);
    setIsUserLoginOpen(true);
  };

  const openUserSignup = () => {
    setIsUserLoginOpen(false);
    setIsUserSignupOpen(true);
  };

  const closeModals = () => {
    setIsUserLoginOpen(false);
    setIsUserSignupOpen(false);
  };

  return (
    <AuthModalContext.Provider
      value={{
        openUserLogin,
        openUserSignup,
        closeModals,
        onLogin,
        onSignup,
        isLoading,
      }}
    >
      {children}
      <UserLoginModal
        isOpen={isUserLoginOpen}
        onClose={closeModals}
        onLogin={onLogin}
        isLoading={isLoading}
      />
      <UserSignupModal
        isOpen={isUserSignupOpen}
        onClose={closeModals}
        onSignup={onSignup}
        isLoading={isLoading}
      />
    </AuthModalContext.Provider>
  );
}
