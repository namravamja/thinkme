"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { BlogCard } from "@/app/blogs/components/blog-card";
import { Pagination } from "@/components/common/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBlogsQuery } from "@/services/api/blogApi";

interface BlogListProps {
  page?: number;
  category?: string;
  search?: string;
  userId?: string;
  limit?: number;
}

// No need to transform - pass data directly to BlogCard in the expected format
const processApiData = (apiBlogs: any[]) => {
  return apiBlogs.map((blog) => ({
    ...blog,
    // Ensure all required fields have defaults
    title: blog.title || "Untitled",
    content: blog.content || "",
    excerpt: blog.excerpt || "No excerpt available",
    category: blog.category || "Uncategorized",
    tags: blog.tags || [],
    user: blog.user || {
      id: 0,
      name: "Unknown Author",
      email: "",
      profile_image: "",
    },
  }));
};

export function BlogList({
  page = 1,
  category,
  search,
  userId,
  limit = 10,
}: BlogListProps) {
  const router = useRouter();
  const { data: apiData, isLoading, error } = useGetBlogsQuery(undefined);

  // Memoized filtered and paginated data
  const processedData = useMemo(() => {
    if (!apiData) return null;

    let filteredBlogs = processApiData(apiData);

    // Filter by category
    if (category) {
      filteredBlogs = filteredBlogs.filter(
        (blog) => blog.category === category
      );
    }

    // Filter by search (title, excerpt, content, tags, and author name)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredBlogs = filteredBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchLower) ||
          blog.excerpt.toLowerCase().includes(searchLower) ||
          blog.content.toLowerCase().includes(searchLower) ||
          blog.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchLower)
          ) ||
          (blog.user?.name || "").toLowerCase().includes(searchLower)
      );
    }

    // Filter by user ID
    if (userId) {
      filteredBlogs = filteredBlogs.filter(
        (blog) =>
          blog.user_id?.toString() === userId ||
          blog.user?.id?.toString() === userId
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

    return {
      blogs: paginatedBlogs,
      total: filteredBlogs.length,
      page,
      totalPages: Math.ceil(filteredBlogs.length / limit),
    };
  }, [apiData, page, category, search, userId, limit]);

  const handleBlogClick = (blogId: string | number) => {
    router.push(`/blogs/${blogId}`);
  };

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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">
          Error loading blogs. Please try again.
        </p>
      </div>
    );
  }

  if (!processedData?.blogs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">No blogs found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {processedData.blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => handleBlogClick(blog.id)}
            className="cursor-pointer transform transition-transform hover:scale-105"
          >
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>

      {/* Only show pagination if limit is not set (i.e., not on homepage) */}
      {limit === 10 && processedData.totalPages > 1 && (
        <Pagination
          currentPage={processedData.page}
          totalPages={processedData.totalPages}
        />
      )}
    </div>
  );
}
