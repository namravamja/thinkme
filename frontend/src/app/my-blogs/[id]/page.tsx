"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Edit3,
  Save,
  X,
  Trash2,
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
} from "lucide-react";
import { mockBlogs } from "@/components/common/mock-data";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { Blog } from "@/types";

const categories = [
  "Technology",
  "Design",
  "Business",
  "Health",
  "Science",
  "Travel",
  "Food",
  "Lifestyle",
];

export default function MyBlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
  });

  const blogId = params?.id as string;

  useEffect(() => {
    if (blogId) {
      // Simulate API call to fetch blog
      const timer = setTimeout(() => {
        const foundBlog = mockBlogs.find((b) => b.id === blogId);

        if (!foundBlog) {
          router.push("/my-blogs");
          return;
        }

        setBlog(foundBlog as Blog);
        setEditForm({
          title: foundBlog.title,
          content: foundBlog.content,
          excerpt: foundBlog.excerpt,
          category: foundBlog.category,
        });
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [blogId, router]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (blog) {
      setEditForm({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        category: blog.category,
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!blog) return;

    setSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update blog state
    const updatedBlog = {
      ...blog,
      ...editForm,
    };

    setBlog(updatedBlog);
    setIsEditing(false);
    setSaving(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to my-blogs page
    router.push("/my-blogs");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl py-8">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">
              Blog not found
            </h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/my-blogs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Blogs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl py-8">
        {/* Back button and actions */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/my-blogs">
              <ArrowLeft className="h-4 w-4" />
              Back to My Blogs
            </Link>
          </Button>

          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button onClick={handleEdit} className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this blog post? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Blog Content */}
        <article className="space-y-8">
          {/* Header */}
          <div className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="text-3xl sm:text-4xl font-serif font-bold border-2 min-h-[3rem]"
                  placeholder="Blog title..."
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-background text-foreground"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Excerpt
                  </label>
                  <Textarea
                    value={editForm.excerpt}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                    className="min-h-[4rem]"
                    placeholder="Brief description of your blog..."
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {blog.title}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {blog.excerpt}
                </p>
              </>
            )}

            {/* Author and meta info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={blog.author.avatar}
                    alt={blog.author.name}
                  />
                  <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {blog.author.name}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(blog.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {blog.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {blog.readTime} min read · {blog.commentsCount} comments ·{" "}
                      {blog.likesCount} likes
                    </span>
                  </div>
                </div>
              </div>

              <Badge variant="secondary" className="w-fit">
                {isEditing ? editForm.category : blog.category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {isEditing ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Content
                </label>
                <Textarea
                  value={editForm.content}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="min-h-[20rem] font-serif text-base leading-relaxed"
                  placeholder="Write your blog content here..."
                />
              </div>
            ) : (
              <div className="whitespace-pre-wrap font-serif text-base leading-relaxed text-slate-800 dark:text-slate-200">
                {blog.content}
              </div>
            )}
          </div>
        </article>

        {/* Footer Actions (only when not editing) */}
        {!isEditing && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-center gap-4">
              <Button onClick={handleEdit} className="gap-2">
                <Edit3 className="h-4 w-4" />
                Edit this post
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
