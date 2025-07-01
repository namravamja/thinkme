"use client";

import { BlogForm } from "@/app/blogs/components/blog-form";
import { Navbar } from "@/components/navbar/navbar";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function CreateBlogPage() {
  // Use the useAuth hook for authentication
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center h-40 text-center space-y-4">
                <Lock className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">
                  Authentication Required
                </h2>
                <p className="text-muted-foreground">
                  Please log in to create a new blog post.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show the blog form if authenticated
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BlogForm mode="create" />
    </div>
  );
}
