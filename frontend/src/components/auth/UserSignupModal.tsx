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
import { useSignupMutation } from "@/services/api/authApi"; // Update this import path

interface UserSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup?: (name: string, email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

export default function UserSignupModal({
  isOpen,
  onClose,
  onSignup,
  isLoading: externalIsLoading,
}: UserSignupModalProps) {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signupError, setSignupError] = useState<string>("");
  const { openLogin } = useAuthModal();

  // RTK Query mutation hook
  const [signup, { isLoading: isSignupLoading, error: signupMutationError }] =
    useSignupMutation();

  const isLoading = isSignupLoading || externalIsLoading || false;

  const handleClose = () => {
    onClose();
    setSignupData({ name: "", email: "", password: "" });
    setSignupError("");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    try {
      // Use RTK Query mutation
      const result = await signup({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      }).unwrap();

      // Call the optional onSignup prop if provided
      if (onSignup) {
        await onSignup(signupData.name, signupData.email, signupData.password);
      }

      // Success - close modal and reset form
      handleClose();
    } catch (error: any) {
      // Handle signup error
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Signup failed. Please try again.";
      setSignupError(errorMessage);
      console.error("Signup error:", error);
    }
  };

  const handleSignInClick = () => {
    handleClose();
    openLogin();
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

  // Clear error when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSignupError("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md min-h-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-center">
            Join ThinkMe
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Create your account to start sharing your thoughts
          </p>
        </DialogHeader>

        <form onSubmit={handleSignup} className="space-y-6 mt-6">
          {/* Error Message */}
          {(signupError || signupMutationError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {signupError ||
                (signupMutationError as any)?.data?.message ||
                "An error occurred during signup"}
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="signup-name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="signup-name"
              type="text"
              value={signupData.name}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter your name"
              required
              disabled={isLoading}
              className="h-11"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="signup-email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="signup-email"
              type="email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="h-11"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="signup-password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="signup-password"
              type="password"
              value={signupData.password}
              onChange={(e) =>
                setSignupData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              placeholder="Create a password"
              required
              disabled={isLoading}
              className="h-11"
            />
          </div>
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-11 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </div>
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Already have an account?
              <button
                type="button"
                onClick={handleSignInClick}
                className="ml-1 text-primary hover:underline cursor-pointer"
                disabled={isLoading}
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
