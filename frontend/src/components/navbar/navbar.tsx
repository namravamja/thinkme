"use client";

import Link from "next/link";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Menu, X, BookOpen, User, LogIn } from "lucide-react";
export function Navbar() {
  // Demo: no auth, always show guest menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSignIn = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
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
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="Guest"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-slate-500 to-slate-600 text-white">
                      <User className="h-5 w-5" />
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
                  {/* Guest user menu only */}
                  <>
                    <div className="flex items-center justify-start gap-3 p-4 border-b border-border/50">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-slate-500 to-slate-600 text-white">
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-semibold text-foreground">
                          Welcome, Guest!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sign in to get started
                        </p>
                      </div>
                    </div>
                    <div className="p-2">
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
                        <BookOpen className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Browse Blogs</span>
                      </Link>
                    </div>
                  </>
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
              {/* Guest mobile menu only */}
              <>
                <div className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 border-b border-border/50 bg-accent/20 rounded-lg mx-2">
                  Welcome, Guest! Sign in to get started.
                </div>
                <Button
                  className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors"
                  size="sm"
                  onClick={handleSignIn}
                >
                  <LogIn className="h-4 w-4 mr-3" />
                  Sign In
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start cursor-pointer hover:bg-accent/50 transition-colors"
                  size="sm"
                >
                  <Link
                    href="/blogs"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpen className="h-4 w-4 mr-3 text-green-500" />
                    Browse Blogs
                  </Link>
                </Button>
              </>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
