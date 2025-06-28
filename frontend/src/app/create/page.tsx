"use client";

import { useAuth } from "@/contexts/auth-context";
import { BlogForm } from "@/app/blogs/components/blog-form";
import { Navbar } from "@/components/navbar/navbar";
import { useAuthModal } from "@/components/auth/auth-modal";

export default function CreateBlogPage() {
  const { user, isLoading } = useAuth();
  const { openUserLogin } = useAuthModal();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Create a New Blog Post</h1>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to create a blog post.
            </p>
            <button
              onClick={openUserLogin}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BlogForm mode="create" />
    </div>
  );
}
