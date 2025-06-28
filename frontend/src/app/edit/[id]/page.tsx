"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { BlogForm } from "@/app/blogs/components/blog-form";
import { Navbar } from "@/components/navbar/navbar";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { mockBlogs } from "@/components/common/mock-data";
import type { Blog } from "@/types";

interface EditBlogPageProps {
  params: {
    id: string;
  };
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [blogLoading, setBlogLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Simulate API call to get blog
    const timer = setTimeout(() => {
      const foundBlog = mockBlogs.find((b) => b.id === params.id);
      setBlog(foundBlog || null);
      setBlogLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [params.id]);

  useEffect(() => {
    if (blog && user && blog.author.id !== user.id) {
      router.push("/");
    }
  }, [blog, user, router]);

  if (authLoading || blogLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || !blog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BlogForm blog={blog} mode="edit" />
    </div>
  );
}
