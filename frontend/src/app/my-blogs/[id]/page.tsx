"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Edit3,
  Save,
  X,
  Trash2,
  ArrowLeft,
  Calendar,
  Clock,
  Upload,
  Lock,
} from "lucide-react";
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
import {
  useGetBlogQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "@/services/api/blogApi";
import { useAuth } from "@/hooks/useAuth"; // Import the useAuth hook
import toast from "react-hot-toast";

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

const predefinedTags = [
  "React",
  "JavaScript",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Python",
  "AI/ML",
  "Web Development",
  "Mobile",
  "Backend",
  "Frontend",
  "DevOps",
  "Tutorial",
  "Guide",
  "Tips",
  "Best Practices",
  "Performance",
  "Security",
  "Open Source",
  "Career",
  "Productivity",
  "Tools",
  "Framework",
  "Library",
];

// Function to calculate reading time based on content
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readTime); // Minimum 1 minute
};

// Helper function to compare arrays
const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

export default function MyBlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id as string;

  // Use the useAuth hook for authentication
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const {
    data: blog,
    isLoading,
    error,
    refetch,
  } = useGetBlogQuery(blogId, {
    skip: !blogId || !isAuthenticated, // Skip if no blogId or not authenticated
  });

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [showPredefinedTags, setShowPredefinedTags] = useState(false);

  // Original data for comparison
  const [originalData, setOriginalData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: [] as string[],
    image: "",
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: [] as string[],
    image: "",
  });

  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageChanged, setImageChanged] = useState(false);

  // Initialize edit form when blog data is loaded
  useEffect(() => {
    if (blog) {
      const blogData = {
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        category: blog.category,
        tags: blog.tags || [],
        image: blog.image,
      };

      setOriginalData(blogData);
      setEditForm(blogData);
      setImagePreview(blog.image);
      setNewImageFile(null);
      setImageChanged(false);
    }
  }, [blog]);

  const getAvailablePredefinedTags = () => {
    return predefinedTags.filter((tag) => !editForm.tags.includes(tag));
  };

  const addTag = (tag?: string) => {
    const tagToAdd = tag || newTag.trim();
    if (tagToAdd && !editForm.tags.includes(tagToAdd)) {
      setEditForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagToAdd],
      }));
      if (!tag) setNewTag("");
    }
  };

  const addPredefinedTag = (tag: string) => {
    addTag(tag);
  };

  const removeTag = (tagToRemove: string) => {
    setEditForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Image must be in JPG, PNG, or WEBP format");
        return;
      }

      setNewImageFile(file);
      setImageChanged(true);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = () => {
    setNewImageFile(null);
    setImagePreview("");
    setImageChanged(true);
    setEditForm((prev) => ({ ...prev, image: "" }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (blog) {
      const blogData = {
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        category: blog.category,
        tags: blog.tags || [],
        image: blog.image,
      };

      setEditForm(blogData);
      setImagePreview(blog.image);
      setNewImageFile(null);
      setImageChanged(false);
    }
    setIsEditing(false);
    setNewTag("");
    setShowPredefinedTags(false);
  };

  // Function to check if there are any changes
  const hasUnsavedChanges = () => {
    const { hasChanges } = buildChangedFormData();
    return hasChanges;
  };
  const buildChangedFormData = () => {
    const formData = new FormData();
    let hasChanges = false;

    // Check title
    if (editForm.title.trim() !== originalData.title) {
      formData.append("title", editForm.title.trim());
      hasChanges = true;
    }

    // Check content
    if (editForm.content.trim() !== originalData.content) {
      formData.append("content", editForm.content.trim());
      hasChanges = true;
    }

    // Check excerpt
    if (editForm.excerpt.trim() !== originalData.excerpt) {
      formData.append("excerpt", editForm.excerpt.trim());
      hasChanges = true;
    }

    // Check category
    if (editForm.category !== originalData.category) {
      formData.append("category", editForm.category);
      hasChanges = true;
    }

    // Check tags (compare arrays)
    if (!arraysEqual(editForm.tags, originalData.tags)) {
      editForm.tags.forEach((tagArrayStr) =>
        formData.append("tags", tagArrayStr)
      );
      hasChanges = true;
    }

    // Check image changes
    if (imageChanged) {
      if (newImageFile) {
        formData.append("image", newImageFile);
      } else {
        // If image was removed, send empty string
        formData.append("image", "");
      }
      hasChanges = true;
    }

    return { formData, hasChanges };
  };

  const handleSave = async () => {
    if (!blog) return;

    const { hasChanges } = buildChangedFormData();

    if (!hasChanges) {
      toast.error("No changes detected");
      setIsEditing(false);
      setNewTag("");
      setShowPredefinedTags(false);
      return;
    }

    // Validation
    if (!editForm.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (editForm.title.trim().length < 5) {
      toast.error("Title must be at least 5 characters long");
      return;
    }

    if (!editForm.excerpt.trim()) {
      toast.error("Excerpt is required");
      return;
    }

    if (editForm.excerpt.trim().length < 10) {
      toast.error("Excerpt must be at least 10 characters long");
      return;
    }

    if (!editForm.content.trim()) {
      toast.error("Content is required");
      return;
    }

    if (editForm.content.trim().length < 50) {
      toast.error("Content must be at least 50 characters long");
      return;
    }

    if (!editForm.category) {
      toast.error("Category is required");
      return;
    }

    if (!editForm.tags.length) {
      toast.error("At least one tag is required");
      return;
    }

    // 🛑 New validation: if image was removed but new image not uploaded
    if (imageChanged && !newImageFile) {
      toast.error("Please upload a new image before saving.");
      return;
    }

    try {
      const { formData } = buildChangedFormData();

      await updateBlog({
        blogId: blog.id,
        formData,
      }).unwrap();

      setOriginalData({
        title: editForm.title,
        content: editForm.content,
        excerpt: editForm.excerpt,
        category: editForm.category,
        tags: [...editForm.tags],
        image: imageChanged
          ? newImageFile
            ? imagePreview
            : ""
          : originalData.image,
      });

      setIsEditing(false);
      setNewImageFile(null);
      setImageChanged(false);
      setNewTag("");
      setShowPredefinedTags(false);
      toast.success("Blog updated successfully!");
    } catch (error) {
      console.error("Failed to update blog:", error);
      toast.error("Failed to update blog. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!blog) return;

    try {
      await deleteBlog(blog.id).unwrap();
      toast.success("Blog deleted successfully!");
      router.push("/my-blogs");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      toast.error("Failed to delete blog. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const readTime = blog ? calculateReadTime(blog.content) : 0;

  // Show loading state while checking authentication or loading blog
  if (authLoading || (isAuthenticated && isLoading)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl py-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show authentication required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl py-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center h-40 text-center space-y-4">
                <Lock className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">
                  Authentication Required
                </h2>
                <p className="text-muted-foreground">
                  Please log in to view and edit your blog posts.
                </p>
                <Button asChild>
                  <Link href="/my-blogs">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to My Blogs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show error state or blog not found
  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl py-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center h-40 text-center space-y-4">
                <X className="h-12 w-12 text-red-500" />
                <h2 className="text-2xl font-semibold text-red-500">
                  {error ? "Error" : "Blog not found"}
                </h2>
                <p className="text-muted-foreground">
                  {error
                    ? "Failed to load blog post. Please try refreshing the page."
                    : "The blog post you're looking for doesn't exist."}
                </p>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/my-blogs">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to My Blogs
                    </Link>
                  </Button>
                  {error && (
                    <Button onClick={() => refetch()} variant="outline">
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
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
                <Button onClick={handleEdit} className="gap-2 cursor-pointer">
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="gap-2 cursor-pointer"
                    >
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
                      <AlertDialogCancel className="cursor-pointer">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer"
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
                  disabled={isUpdating || !hasUnsavedChanges()}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isUpdating
                    ? "Saving..."
                    : hasUnsavedChanges()
                    ? "Save Changes"
                    : "No Changes"}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Blog Content */}
        <article className="space-y-8">
          {/* Blog Image */}
          {(blog.image || imagePreview || isEditing) && (
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Blog Image
                  </Label>

                  {/* Current/Preview Image */}
                  {imagePreview ? (
                    <div className="relative group">
                      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-lg border">
                        <img
                          src={imagePreview}
                          alt="Blog preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                          className="flex items-center cursor-pointer gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragOver
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">
                        Drop image here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports JPG, PNG, WEBP
                      </p>
                    </div>
                  )}

                  {/* Upload New Image */}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : blog.image ? (
                <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-lg">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}
            </div>
          )}

          {/* Header */}
          <div className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="text-2xl sm:text-3xl font-serif font-bold min-h-[3rem]"
                    placeholder="Blog title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
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
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="relative">
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onFocus={() => setShowPredefinedTags(true)}
                        placeholder="Add a tag..."
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                      />
                      <Button
                        type="button"
                        onClick={() => addTag()}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>

                    {showPredefinedTags &&
                      getAvailablePredefinedTags().length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-20 bg-background border border-input rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs text-muted-foreground font-medium">
                                Popular Tags:
                              </p>
                              <button
                                type="button"
                                onClick={() => setShowPredefinedTags(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {getAvailablePredefinedTags()
                                .slice(0, 15)
                                .map((tag) => (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => addPredefinedTag(tag)}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors cursor-pointer"
                                  >
                                    <span>{tag}</span>
                                    <span className="text-primary font-bold">
                                      +
                                    </span>
                                  </button>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  {editForm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editForm.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {blog.title}
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  {blog.excerpt}
                </p>
              </>
            )}

            {/* Meta info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(blog.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </span>
                {blog.updated_at && (
                  <span className="text-xs">
                    Updated {formatDate(blog.updated_at)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="w-fit">
                  {isEditing ? editForm.category : blog.category}
                </Badge>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && !isEditing && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
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
              <div className="whitespace-pre-wrap font-serif text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
                {blog.content}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
