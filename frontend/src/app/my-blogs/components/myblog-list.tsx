"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MyBlogCard } from "@/app/my-blogs/components/myblog-card";
import { Pagination } from "@/components/common/pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogData {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  image: string;
  user_id: number;
  created_at: string;
  updated_at: string | null;
}

interface BlogListProps {
  page?: number;
  category?: string;
  search?: string;
  userId?: string;
  limit?: number;
  blogs?: BlogData[]; // Accept blogs as prop from RTK Query
  isLoading?: boolean;
  error?: any;
}

export function MyBlogList({
  page = 1,
  category,
  search,
  userId,
  limit = 10,
  blogs = [],
  isLoading = false,
  error,
}: BlogListProps) {
  const router = useRouter();
  const [filteredData, setFilteredData] = useState<{
    blogs: BlogData[];
    total: number;
    page: number;
    totalPages: number;
  } | null>(null);

  const handleBlogClick = (blogId: number) => {
    router.push(`/my-blogs/${blogId}`);
  };

  useEffect(() => {
    if (!isLoading && blogs.length > 0) {
      let filteredBlogs = [...blogs];

      // Apply filters
      if (category) {
        filteredBlogs = filteredBlogs.filter(
          (blog) => blog.category === category
        );
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredBlogs = filteredBlogs.filter(
          (blog) =>
            blog.title.toLowerCase().includes(searchLower) ||
            blog.content.toLowerCase().includes(searchLower) ||
            blog.excerpt.toLowerCase().includes(searchLower) ||
            blog.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      if (userId) {
        filteredBlogs = filteredBlogs.filter(
          (blog) => blog.user_id.toString() === userId
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

      setFilteredData({
        blogs: paginatedBlogs,
        total: filteredBlogs.length,
        page,
        totalPages: Math.ceil(filteredBlogs.length / limit),
      });
    } else if (!isLoading && blogs.length === 0) {
      setFilteredData({
        blogs: [],
        total: 0,
        page,
        totalPages: 0,
      });
    }
  }, [blogs, isLoading, page, category, search, userId, limit]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: limit === 3 ? 3 : 9 }).map((_, i) => (
          <div key={i} className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-48 w-full rounded-lg" />
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

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">
          Error loading blogs: {error.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  // Handle empty state
  if (!filteredData?.blogs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">
          {search || category
            ? "No blogs found matching your criteria."
            : "No blogs found."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {filteredData.blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => handleBlogClick(blog.id)}
            className="cursor-pointer transform transition-transform hover:scale-105"
          >
            <MyBlogCard blog={blog} authorName="User" />
          </div>
        ))}
      </div>

      {/* Only show pagination if limit is not set (i.e., not on homepage) */}
      {limit === 10 && filteredData.totalPages > 1 && (
        <Pagination
          currentPage={filteredData.page}
          totalPages={filteredData.totalPages}
        />
      )}
    </div>
  );
}
