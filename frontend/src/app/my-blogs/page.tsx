"use client";

import { useAuth } from "@/contexts/auth-context";
import { BlogList } from "@/app/blogs/components/blog-list";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { PenTool } from "lucide-react";

export default function MyBlogsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number.parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold">My Blogs</h1>
          <Button asChild>
            <Link href="/create">
              <PenTool className="h-4 w-4 mr-2" />
              Write new blog
            </Link>
          </Button>
        </div>

        <BlogList page={page} userId={user.id} />
      </div>
    </div>
  );
}
