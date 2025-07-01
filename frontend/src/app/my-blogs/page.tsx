"use client";

import { MyBlogList } from "@/app/my-blogs/components/myblog-list";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PenTool, Lock, X } from "lucide-react";
import { useGetUserBlogsQuery } from "@/services/api/blogApi";
import { useAuth } from "@/hooks/useAuth";

export default function MyBlogsPage() {
  const searchParams = useSearchParams();
  const page = Number.parseInt(searchParams.get("page") || "1");

  // Use the useAuth hook for authentication
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // RTK Query hook to fetch user blogs
  const {
    data: blogs = [],
    isLoading,
    error,
    refetch,
  } = useGetUserBlogsQuery(undefined, {
    skip: !isAuthenticated, // Skip the query if not authenticated
    refetchOnMountOrArgChange: true,
  });

  // Show loading state while checking authentication
  if (authLoading || (isAuthenticated && isLoading)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl py-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show authentication required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl py-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center h-40 text-center space-y-4">
                <Lock className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">
                  Authentication Required
                </h2>
                <p className="text-muted-foreground">
                  Please log in to view and manage your blogs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show error state if there's an error loading blogs
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl py-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center h-40 text-center space-y-4">
                <X className="h-12 w-12 text-red-500" />
                <h2 className="text-2xl font-semibold text-red-500">Error</h2>
                <p className="text-muted-foreground">
                  Failed to load your blogs. Please try refreshing the page.
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold">My Blogs</h1>
            {!isLoading && blogs.length > 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {blogs.length} {blogs.length === 1 ? "blog" : "blogs"} published
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link href="/create">
                <PenTool className="h-4 w-4 mr-2" />
                Write new blog
              </Link>
            </Button>
          </div>
        </div>

        <MyBlogList
          page={page}
          blogs={blogs}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
