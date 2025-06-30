"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Trash2 } from "lucide-react";
import { useCreateBlogMutation } from "@/services/api/blogApi";
import type { Blog } from "@/types";
import toast from "react-hot-toast";

interface BlogFormProps {
  blog?: Blog;
  mode: "create" | "edit";
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

export function BlogForm({ blog, mode }: BlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof blog?.image === "string" ? blog.image : null
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [createBlog, refetch] = useCreateBlogMutation();

  const [formData, setFormData] = useState({
    title: blog?.title || "",
    content: blog?.content || "",
    excerpt: blog?.excerpt || "",
    category: blog?.category || categories[0],
    tags: blog?.tags || [],
  });

  const [newTag, setNewTag] = useState("");
  const [showPredefinedTags, setShowPredefinedTags] = useState(false);

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

  const getAvailablePredefinedTags = () => {
    return predefinedTags.filter((tag) => !formData.tags.includes(tag));
  };

  const addPredefinedTag = (tag: string) => {
    addTag(tag);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic required field validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      setIsLoading(false);
      return;
    }

    if (formData.title.trim().length < 5) {
      toast.error("Title must be at least 5 characters long");
      setIsLoading(false);
      return;
    }

    if (!formData.excerpt.trim()) {
      toast.error("Excerpt is required");
      setIsLoading(false);
      return;
    }

    if (formData.excerpt.trim().length < 10) {
      toast.error("Excerpt must be at least 10 characters long");
      setIsLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Content is required");
      setIsLoading(false);
      return;
    }

    if (formData.content.trim().length < 50) {
      toast.error("Content must be at least 50 characters long");
      setIsLoading(false);
      return;
    }

    if (!formData.category) {
      toast.error("Category is required");
      setIsLoading(false);
      return;
    }

    if (!formData.tags.length) {
      toast.error("At least one tag is required");
      setIsLoading(false);
      return;
    }

    if (!imageFile && mode === "create") {
      toast.error("Featured image is required");
      setIsLoading(false);
      return;
    }

    // Check image format if a file is selected
    if (imageFile) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(imageFile.type)) {
        toast.error("Image must be in JPG, PNG, or WEBP format");
        setIsLoading(false);
        return;
      }
    }

    const form = new FormData();
    form.append("title", formData.title.trim());
    form.append("content", formData.content.trim());
    form.append("excerpt", formData.excerpt.trim());
    form.append("category", formData.category);
    formData.tags.forEach((tag) => form.append("tags", tag));
    if (imageFile) {
      form.append("image", imageFile);
    }

    try {
      await createBlog(form).unwrap();
      toast.success("Blog created successfully!");
      router.push("/my-blogs");
    } catch (error: any) {
      console.error(error);
      toast.error("Error creating blog");
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = (tag?: string) => {
    const tagToAdd = tag || newTag.trim();
    if (tagToAdd && !formData.tags.includes(tagToAdd)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagToAdd],
      }));
      if (!tag) setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setImageFile(file);
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
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">
            {mode === "create" ? "Create New Blog" : "Edit Blog"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter blog title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Brief description of your blog..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Featured Image</Label>
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md border"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
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
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Write your blog content..."
                rows={15}
                required
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
                    className="cursor-pointer"
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

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
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

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Blog"
                  : "Update Blog"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
