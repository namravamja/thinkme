"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Clock, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  const [isLiked, setIsLiked] = useState(blog.isLiked || false);
  const [likesCount, setLikesCount] = useState(blog.likesCount);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
  };

  return (
    <Card className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden border border-border/50 hover:border-blue-500/20 bg-card/50 backdrop-blur-sm">
      <Link href={`/blogs/${blog.id}`} className="flex-1">
        <CardHeader className="pb-3 p-4 sm:p-6">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all duration-200">
              <AvatarImage
                src={blog.author.avatar || "/placeholder.svg"}
                alt={blog.author.name}
              />
              <AvatarFallback className="text-xs sm:text-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {blog.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="font-medium text-sm sm:text-base truncate text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
                {blog.author.name}
              </span>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <span className="truncate">
                  {formatDistanceToNow(new Date(blog.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
          <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 sm:line-clamp-3 text-slate-900 dark:text-slate-100">
            {blog.title}
          </h3>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col p-4 sm:p-6 sm:pt-0">
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base mb-4 line-clamp-2 sm:line-clamp-3 flex-1 leading-relaxed">
            {blog.excerpt}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
            <Badge
              variant="secondary"
              className="text-xs sm:text-sm px-2 py-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
            >
              {blog.category}
            </Badge>
            {blog.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs px-2 py-1 hidden sm:inline-flex cursor-pointer hover:bg-accent/50 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Link>

      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-all duration-200 cursor-pointer hover:scale-105",
                isLiked && "text-red-500"
              )}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-all duration-200",
                  isLiked && "fill-current scale-110"
                )}
              />
              <span className="text-sm font-medium">{likesCount}</span>
            </Button>
            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{blog.commentsCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
            <span>{blog.readTime} min</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
