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
import toast from "react-hot-toast";

interface UserSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export default function UserSignupModal({
  isOpen,
  onClose,
  onSignup,
  isLoading,
}: UserSignupModalProps) {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleClose = () => {
    onClose();
    setSignupData({ name: "", email: "", password: "" });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSignup(signupData.name, signupData.email, signupData.password);
      toast.success("Account created successfully!");
      handleClose();
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    }
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-center">
            Sign Up
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name">Name</Label>
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
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
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
