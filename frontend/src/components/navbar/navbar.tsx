"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  X,
  BookOpen,
  User,
  LogIn,
  LogOut,
  Settings,
  PlusCircle,
  FileText,
} from "lucide-react";
import { useAuthModal } from "@/components/provider/auth-model-provider";
import { useGetCurrentUserQuery } from "@/services/api/userApi";
import { useLogoutMutation } from "@/services/api/authApi";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    data: userData,
    isError: isUserError,
    refetch: refetchUser,
  } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Add logout mutation hook
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();

  // Get auth modal functions
  const { openLogin } = useAuthModal();

  // Check if user is authenticated (has valid user data)
  const isAuthenticated = userData && !isUserError;
  const userName =
    userData?.name || userData?.username || userData?.email || "User";
  const userInitials = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);

      // Call the logout mutation
      await logout(undefined).unwrap();

      // Force refetch user data to clear cache and update the UI state
      await refetchUser();

      // Optional: If you're using Redux Toolkit Query, you might want to invalidate the cache
      // dispatch(userApi.util.invalidateTags(['User']));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSignIn = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    refetchUser();
    openLogin();
  };

  return (
    <>
      <nav className="border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-all duration-200">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                Think Me
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />

              {/* User Profile Dropdown - Hover trigger */}
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-transparent cursor-pointer group"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all duration-200">
                    {/* Fixed: Always render AvatarImage but with conditional src */}
                    <AvatarImage
                      src={
                        isAuthenticated && userData?.profile_image
                          ? userData.profile_image
                          : null
                      }
                      alt={isAuthenticated ? userName : "Guest"}
                    />
                    <AvatarFallback
                      className={`text-white ${
                        isAuthenticated
                          ? "bg-gradient-to-br from-blue-500 to-blue-600"
                          : "bg-gradient-to-br from-slate-500 to-slate-600"
                      }`}
                    >
                      {isAuthenticated ? (
                        userInitials
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Button>

                {/* Dropdown Content */}
                <div
                  className={`absolute right-0 top-full mt-2 w-64 bg-background/95 backdrop-blur-md border border-border/50 shadow-xl rounded-lg transition-all duration-200 origin-top-right ${
                    isDropdownOpen
                      ? "opacity-100 scale-100 translate-y-0 visible"
                      : "opacity-0 scale-95 -translate-y-2 invisible"
                  }`}
                >
                  {isAuthenticated ? (
                    // Authenticated user menu
                    <>
                      <div className="flex items-center justify-start gap-3 p-4 border-b border-border/50">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-semibold text-foreground">
                            {userName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {userData?.email || "Authenticated User"}
                          </p>
                        </div>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          href="/create"
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-green-50 dark:hover:bg-green-950/20 text-green-600 dark:text-green-400 transition-colors cursor-pointer w-full"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span className="font-medium">Create Blog</span>
                        </Link>

                        <Link
                          href="/my-blogs"
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer w-full"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">My Blogs</span>
                        </Link>

                        <Link
                          href="/blogs"
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer w-full"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <BookOpen className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">Browse Blogs</span>
                        </Link>

                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer w-full"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Profile Settings</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          disabled={logoutLoading}
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="font-medium">
                            {logoutLoading ? "Signing Out..." : "Sign Out"}
                          </span>
                        </button>
                      </div>
                    </>
                  ) : (
                    // Guest user menu
                    <>
                      <div className="flex items-center justify-start gap-3 p-4 border-b border-border/50">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-semibold text-foreground">
                            Welcome, Guest!
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Sign in to get started
                          </p>
                        </div>
                      </div>
                      <div className="p-2 space-y-1">
                        <button
                          onClick={handleSignIn}
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer w-full"
                        >
                          <LogIn className="h-4 w-4" />
                          <span className="font-medium">Sign In</span>
                        </button>

                        <Link
                          href="/blogs"
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer w-full"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <BookOpen className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">Browse Blogs</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="h-9 w-9 px-0 cursor-pointer hover:bg-accent/50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border/50 py-4 space-y-2 bg-background/95 backdrop-blur-md">
              {isAuthenticated ? (
                // Authenticated mobile menu
                <>
                  <div className="px-4 py-3 text-sm border-b border-border/50 bg-accent/20 rounded-lg mx-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={userData?.profile_image || null}
                          alt={userName}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {userName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {userData?.email || "Authenticated User"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full mx-2 cursor-pointer bg-green-600 hover:bg-green-700 transition-colors"
                    size="sm"
                  >
                    <Link
                      href="/create-blog"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Blog
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-600 dark:text-blue-400 transition-colors mx-2"
                    size="sm"
                  >
                    <Link
                      href="/my-blogs"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FileText className="h-4 w-4 mr-3" />
                      My Blogs
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start cursor-pointer hover:bg-accent/50 transition-colors mx-2"
                    size="sm"
                  >
                    <Link
                      href="/blogs"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen className="h-4 w-4 mr-3 text-purple-500" />
                      Browse Blogs
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start cursor-pointer hover:bg-accent/50 transition-colors mx-2"
                    size="sm"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3 text-gray-500" />
                      Profile Settings
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 transition-colors mx-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    size="sm"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    {logoutLoading ? "Signing Out..." : "Sign Out"}
                  </Button>
                </>
              ) : (
                // Guest mobile menu
                <>
                  <div className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 border-b border-border/50 bg-accent/20 rounded-lg mx-2">
                    Welcome, Guest! Sign in or sign up to get started.
                  </div>
                  <div className="flex gap-2 mx-2">
                    <Button
                      className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors"
                      size="sm"
                      onClick={handleSignIn}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start cursor-pointer hover:bg-accent/50 transition-colors mx-2"
                    size="sm"
                  >
                    <Link
                      href="/blogs"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen className="h-4 w-4 mr-3 text-purple-500" />
                      Browse Blogs
                    </Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
