"use client";

import type React from "react";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";

interface User {
  id: number;
  email: string;
  name: string;
  bio?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  profile_image?: string;
}

interface Blog {
  title?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  image?: string;
  id: number;
  user_id?: number;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

interface BlogCardProps {
  blog: Blog;
}

// Helper function to calculate read time based on content length
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

// Helper function to safely format date
const formatSafeDate = (dateString?: string): string => {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Unknown date";
  }

  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return "Unknown date" + error;
  }
};

export function BlogCard({ blog }: BlogCardProps) {
  const readTime = calculateReadTime(blog.content || "");

  // Handle both user object and fallback to defaults
  const author = blog.user || {
    id: 0,
    name: "Unknown Author",
    email: "",
    profile_image: "",
  };

  return (
    <Card className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden border border-border/50 hover:border-blue-500/20 bg-card/50 backdrop-blur-sm">
      <Link href={`/blogs/${blog.id}`} className="flex-1">
        <CardHeader className="pb-3 p-4 sm:p-6">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all duration-200">
              <AvatarImage
                src={author.profile_image || "/placeholder.svg"}
                alt={author.name || "Unknown Author"}
              />
              <AvatarFallback className="text-xs sm:text-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {(author.name || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="font-medium text-sm sm:text-base truncate text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
                {author.name || "Unknown Author"}
              </span>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <span className="truncate">
                  {formatSafeDate(blog.created_at)}
                </span>
              </div>
            </div>
          </div>
          <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 sm:line-clamp-3 text-slate-900 dark:text-slate-100">
            {blog.title || "Untitled"}
          </h3>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col p-4 sm:p-6 sm:pt-0">
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base mb-4 line-clamp-2 sm:line-clamp-3 flex-1 leading-relaxed">
            {blog.excerpt || "No excerpt available"}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
            <Badge
              variant="secondary"
              className="text-xs sm:text-sm px-2 py-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
            >
              {blog.category || "Uncategorized"}
            </Badge>
            {(blog.tags || []).slice(0, 2).map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="outline"
                className="text-xs px-2 py-1 hidden sm:inline-flex cursor-pointer hover:bg-accent/50 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Read time only */}
          <div className="flex items-center justify-end pt-3 border-t border-border/50">
            <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
              <span>{readTime} min read</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
