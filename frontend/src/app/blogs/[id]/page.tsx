"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { use } from "react";
import {
  ArrowLeft,
  Clock,
  Share2,
  Globe,
  Twitter,
  Github,
  Linkedin,
  Calendar,
  Mail,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useGetBlogQuery } from "@/services/api/blogApi"; // Adjust import path as needed

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = use(params);
  const { data: blog, isLoading, error } = useGetBlogQuery(id);

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

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
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

  if (error || !blog) {
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

  const readTime = calculateReadTime(blog.content);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to blogs
          </Link>
        </Button>

        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            {/* Blog Image */}
            {blog.image && (
              <div className="mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-64 sm:h-96 object-cover rounded-lg"
                />
              </div>
            )}

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-slate-900 dark:text-slate-100">
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            {/* Author Info */}
            <div className="flex items-start justify-between mb-6 gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                  <AvatarImage
                    src={blog.user.profile_image || "/placeholder.svg"}
                    alt={blog.user.name}
                  />
                  <AvatarFallback className="text-lg">
                    {blog.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-base sm:text-lg text-slate-900 dark:text-slate-100">
                    {blog.user.name}
                  </p>
                  {blog.user.bio && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {blog.user.bio}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Published{" "}
                        {formatDistanceToNow(new Date(blog.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    {blog.updated_at !== blog.created_at && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                          <span>
                            Updated{" "}
                            {formatDistanceToNow(new Date(blog.updated_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </>
                    )}
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span>{readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* User Social Links */}
            {(blog.user.website ||
              blog.user.twitter ||
              blog.user.github ||
              blog.user.linkedin ||
              blog.user.email) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {blog.user.email && (
                    <Badge variant="outline" className="text-xs">
                      <Mail className="h-3 w-3 mr-1" />
                      {blog.user.email}
                    </Badge>
                  )}
                  {blog.user.website && (
                    <Badge variant="outline" className="text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      <a
                        href={blog.user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Website
                      </a>
                    </Badge>
                  )}
                  {blog.user.twitter && (
                    <Badge variant="outline" className="text-xs">
                      <Twitter className="h-3 w-3 mr-1" />
                      <a
                        href={`https://twitter.com/${blog.user.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        @{blog.user.twitter}
                      </a>
                    </Badge>
                  )}
                  {blog.user.github && (
                    <Badge variant="outline" className="text-xs">
                      <Github className="h-3 w-3 mr-1" />
                      <a
                        href={`https://github.com/${blog.user.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {blog.user.github}
                      </a>
                    </Badge>
                  )}
                  {blog.user.linkedin && (
                    <Badge variant="outline" className="text-xs">
                      <Linkedin className="h-3 w-3 mr-1" />
                      <a
                        href={`https://linkedin.com/in/${blog.user.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {blog.user.linkedin}
                      </a>
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Tags and Category */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {blog.category}
              </Badge>
              {blog.tags?.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs sm:text-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Content */}
          <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg mb-8 sm:mb-12">
            {blog.content}
          </div>

          <Separator className="my-8 sm:my-12" />

          {/* Author Bio Section */}
          {blog.user.bio && (
            <>
              <div className="mb-8">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage
                      src={blog.user.profile_image || "/placeholder.svg"}
                      alt={blog.user.name}
                    />
                    <AvatarFallback>
                      {blog.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                      About {blog.user.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {blog.user.bio}
                    </p>
                  </div>
                </div>
              </div>
              <Separator className="my-8" />
            </>
          )}
        </article>
      </div>
    </div>
  );
}
