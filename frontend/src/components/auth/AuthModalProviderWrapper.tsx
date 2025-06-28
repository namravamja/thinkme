"use client";

import { useAuth } from "@/contexts/auth-context";
import { AuthModalProvider } from "./auth-modal";

interface AuthModalProviderWrapperProps {
  children: React.ReactNode;
}

export function AuthModalProviderWrapper({
  children,
}: AuthModalProviderWrapperProps) {
  const { login, signup, isLoading } = useAuth();

  return (
    <AuthModalProvider onLogin={login} onSignup={signup} isLoading={isLoading}>
      {children}
    </AuthModalProvider>
  );
}
