"use client";

import { useEffect, useState, useRef } from "react";
import { useGetCurrentUserQuery } from "@/services/api/userApi";
import { useAuthModal } from "@/components/provider/auth-model-provider";

interface ApiError {
  status?: number;
  data?: unknown;
  [key: string]: unknown;
}

interface UserData {
  name?: string;
  email?: string;
}

export function useAuth() {
  const [hasTriedAuth, setHasTriedAuth] = useState(false);
  const { openLogin, closeLogin } = useAuthModal();
  const wasAuthenticatedRef = useRef(false);
  const hasOpenedLoginRef = useRef(false);

  const {
    data: userData,
    isLoading: userLoading,
    isError: isUserError,
    error: userError,
    refetch: refetchUser,
  } = useGetCurrentUserQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  // Determine if user is currently authenticated
  const isAuthenticated = !isUserError && !!userData && hasTriedAuth;

  useEffect(() => {
    if (isUserError || userData) {
      setHasTriedAuth(true);
    }
  }, [isUserError, userData]);

  // Handle opening login modal when not authenticated
  useEffect(() => {
    if (hasTriedAuth) {
      if (!isAuthenticated && !hasOpenedLoginRef.current) {
        // User is not authenticated, open login modal
        openLogin();
        hasOpenedLoginRef.current = true;
        wasAuthenticatedRef.current = false;
      } else if (isAuthenticated && !wasAuthenticatedRef.current) {
        // User just became authenticated, close login modal
        closeLogin();
        wasAuthenticatedRef.current = true;
        hasOpenedLoginRef.current = false;
      }
    }
  }, [hasTriedAuth, isAuthenticated, openLogin, closeLogin]);

  // Reset flags when user logs out (becomes unauthenticated after being authenticated)
  useEffect(() => {
    if (wasAuthenticatedRef.current && !isAuthenticated && hasTriedAuth) {
      // User was authenticated but now is not (logout scenario)
      hasOpenedLoginRef.current = false;
      wasAuthenticatedRef.current = false;
    }
  }, [isAuthenticated, hasTriedAuth]);

  const apiError = userError as ApiError | undefined;

  const user =
    isAuthenticated && userData
      ? {
          name: (userData as UserData)?.name || "User",
          email: (userData as UserData)?.email || "",
        }
      : null;

  return {
    isAuthenticated,
    isLoading: userLoading && !hasTriedAuth,
    isError: isUserError,
    error: apiError,
    user,
    refetch: refetchUser,
  };
}
