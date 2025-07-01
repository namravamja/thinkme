"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthModal } from "@/components/provider/auth-model-provider";
import { useLoginMutation } from "@/services/api/authApi";
import { useGetCurrentUserQuery } from "@/services/api/userApi";
import toast from "react-hot-toast";

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

export default function UserLoginModal({
  isOpen,
  onClose,
  onLogin,
  isLoading: externalIsLoading,
}: UserLoginModalProps) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string>("");

  const { openSignup } = useAuthModal();
  const [login, { isLoading: isLoginLoading, error: loginMutationError }] =
    useLoginMutation();

  const isLoading = isLoginLoading || externalIsLoading || false;

  const handleClose = () => {
    onClose();
    setLoginData({ email: "", password: "" });
    setLoginError("");
  };

  const [shouldFetchUser, setShouldFetchUser] = useState(false);

  const { refetch: refetchUser } = useGetCurrentUserQuery(undefined, {
    skip: !shouldFetchUser,
  });

  useEffect(() => {
    if (shouldFetchUser) {
      refetchUser().then(() => {
        // Reset the fetch trigger after successful refetch
        setShouldFetchUser(false);
      });
    }
  }, [shouldFetchUser, refetchUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      // Perform login
      await login({
        email: loginData.email,
        password: loginData.password,
      }).unwrap();

      // Trigger user data fetch
      setShouldFetchUser(true);

      // Call optional onLogin callback if provided
      if (onLogin) {
        await onLogin(loginData.email, loginData.password);
      }

      // Close modal immediately after successful login
      handleClose();

      // Optional: Show success message
      // You can uncomment this if you have toast notifications set up
      toast.success("Successfully logged in!");
    } catch (error: unknown) {
      let errorMessage = "Login failed. Please try again.";
      if (typeof error === "object" && error !== null) {
        if (
          "data" in error &&
          typeof (error as { data?: { message?: string } }).data?.message ===
            "string"
        ) {
          errorMessage = (error as { data: { message: string } }).data.message;
        } else if (
          "message" in error &&
          typeof (error as { message?: string }).message === "string"
        ) {
          errorMessage = (error as { message: string }).message;
        }
      }
      setLoginError(errorMessage);
      console.error("Login error:", error);
    }
  };

  const handleSignupClick = () => {
    handleClose();
    openSignup();
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Clear errors when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLoginError("");
      setLoginData({ email: "", password: "" });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md min-h-[400px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-center">
            Welcome to ThinkMe
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Sign in to continue your blogging journey
          </p>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-6 mt-6">
          {(loginError || loginMutationError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {loginError ||
                (typeof loginMutationError === "object" &&
                loginMutationError !== null &&
                "data" in loginMutationError &&
                typeof (loginMutationError as { data?: { message?: string } })
                  .data?.message === "string"
                  ? (loginMutationError as { data: { message: string } }).data
                      .message
                  : "An error occurred during login")}
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="login-email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="h-11"
              autoComplete="email"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-sm font-medium">
                Password
              </Label>
            </div>
            <Input
              id="login-password"
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              placeholder="Enter your password"
              required
              disabled={isLoading}
              className="h-11"
              autoComplete="current-password"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading || !loginData.email || !loginData.password}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account?
              <button
                type="button"
                onClick={handleSignupClick}
                className="ml-1 text-primary hover:underline cursor-pointer"
                disabled={isLoading}
              >
                Sign up here
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
