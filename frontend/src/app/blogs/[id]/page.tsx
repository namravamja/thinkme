"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import {
  Edit,
  Trash2,
  ArrowLeft,
  Clock,
  Share2,
  MoreVertical,
  Heart,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockBlogs } from "@/components/common/mock-data";
import type { Blog } from "@/types";
import { cn } from "@/lib/utils";

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const foundBlog = mockBlogs.find((b) => b.id === params.id);
      if (foundBlog) {
        setBlog(foundBlog);
        setIsLiked(foundBlog.isLiked || false);
        setLikesCount(foundBlog.likesCount);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    setIsDeleting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Blog deleted successfully");
      router.push("/");
    }, 1000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
          <Skeleton className="h-8 w-24 mb-6" />
          <Skeleton className="h-8 sm:h-12 w-3/4 mb-4" />
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            Blog not found
          </h1>
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === blog.author.id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to blogs
          </Link>
        </Button>

        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-slate-900 dark:text-slate-100">
              {blog.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-start justify-between mb-6 gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  <AvatarImage
                    src={blog.author.avatar || "/placeholder.svg"}
                    alt={blog.author.name}
                  />
                  <AvatarFallback>
                    {blog.author.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate text-slate-900 dark:text-slate-100">
                    {blog.author.name}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <span>
                      {formatDistanceToNow(new Date(blog.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span>{blog.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Desktop Actions */}
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  {isAuthor && (
                    <>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/edit/${blog.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>

                {/* Mobile Actions */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      {isAuthor && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href={`/edit/${blog.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={handleDelete}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Tags and Category */}
            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {blog.category}
              </Badge>
              {blog.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs sm:text-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Engagement Bar */}
            <div className="flex items-center gap-4 sm:gap-6 py-3 sm:py-4 border-y">
              <Button
                variant="ghost"
                size="default"
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
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="text-sm">{blog.commentsCount} comments</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg mb-8 sm:mb-12">
            {blog.content}
          </div>

          <Separator className="my-8 sm:my-12" />

          {/* Comments Section Placeholder */}
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">
              Comments section coming soon...
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
