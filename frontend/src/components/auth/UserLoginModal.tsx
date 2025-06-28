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
// import toast from "react-hot-toast";
// import { useLoginMutation } from "@/services/api/authApi";

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (email: string, password: string) => Promise<void>; // Optional for backward compatibility
  isLoading?: boolean; // Optional for backward compatibility
}

export default function UserLoginModal({
  isOpen,
  onClose,
  onLogin, // Keep for backward compatibility but won't be used
  isLoading: externalIsLoading, // Rename to avoid conflict
}: UserLoginModalProps) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  // const { openUserSignup } = useAuthModal();
  // const [login, { isLoading }] = useLoginMutation();
  const isLoading = false;

  const handleClose = () => {
    onClose();
    setLoginData({ email: "", password: "" });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: just close modal
    handleClose();
  };

  const handleSignupClick = () => {
    handleClose();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-sm font-medium">
                Password
              </Label>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot password?
              </button>
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
            />
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Don't have an account?
              <button
                type="button"
                onClick={handleSignupClick}
                className="ml-1 text-primary hover:underline"
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
