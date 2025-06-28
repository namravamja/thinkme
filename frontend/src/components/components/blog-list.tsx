"use client";

import { useState, useEffect } from "react";
import { BlogCard } from "@/app/blogs/components/blog-card";
import { Pagination } from "@/components/common/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { mockBlogs } from "@/components/common/mock-data";

interface BlogListProps {
  page?: number;
  category?: string;
  search?: string;
  userId?: string;
  limit?: number;
}

export function BlogList({
  page = 1,
  category,
  search,
  userId,
  limit = 10,
}: BlogListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    blogs: any[];
    total: number;
    page: number;
    totalPages: number;
  } | null>(null);

  useEffect(() => {
    setIsLoading(true);

    // Simulate API call
    const timer = setTimeout(() => {
      let filteredBlogs = [...mockBlogs];

      if (category) {
        filteredBlogs = filteredBlogs.filter(
          (blog) => blog.category === category
        );
      }

      if (search) {
        filteredBlogs = filteredBlogs.filter(
          (blog) =>
            blog.title.toLowerCase().includes(search.toLowerCase()) ||
            blog.content.toLowerCase().includes(search.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (userId) {
        filteredBlogs = filteredBlogs.filter(
          (blog) => blog.author.id === userId
        );
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

      setData({
        blogs: paginatedBlogs,
        total: filteredBlogs.length,
        page,
        totalPages: Math.ceil(filteredBlogs.length / limit),
      });
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [page, category, search, userId, limit]);

  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: limit === 3 ? 3 : 9 }).map((_, i) => (
          <div key={i} className="space-y-4 p-6 border rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
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

  if (!data?.blogs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">No blogs found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {data.blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {/* Only show pagination if limit is not set (i.e., not on homepage) */}
      {limit === 10 && data.totalPages > 1 && (
        <Pagination currentPage={data.page} totalPages={data.totalPages} />
      )}
    </div>
  );
}
