"use client";

import { MyBlogList } from "@/app/my-blogs/components/myblog-list";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PenTool } from "lucide-react";
import { useGetUserBlogsQuery } from "@/services/api/blogApi"; // Adjust the import path to match your RTK setup

export default function MyBlogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number.parseInt(searchParams.get("page") || "1");

  // RTK Query hook to fetch user blogs
  const {
    data: blogs = [],
    isLoading,
    error,
    refetch,
  } = useGetUserBlogsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

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
            {/* Refresh button for manual refetch */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
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
