"use client";

import { BlogCard } from "@/app/blogs/components/blog-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBlogsQuery } from "@/services/api/blogApi";
import type { Blog } from "@/types";

export function FeaturedBlogs() {
  const { data: blogs, isLoading, error } = useGetBlogsQuery(undefined);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          Error loading blogs. Please try again later.
        </p>
      </div>
    );
  }

  const featuredBlogs = blogs?.slice(0, 3) || [];

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {featuredBlogs.map((blog: Blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
