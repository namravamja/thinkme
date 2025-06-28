"use client";

import { useState, useEffect } from "react";
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
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [blogLoading, setBlogLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get blog
    const timer = setTimeout(() => {
      const foundBlog = mockBlogs.find((b) => b.id === params.id);
      setBlog(foundBlog || null);
      setBlogLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [params.id]);

  if (blogLoading) {
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

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
            <p className="text-muted-foreground">
              The blog post you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BlogForm blog={blog} mode="edit" />
    </div>
  );
}
