"use client";

import { BlogForm } from "@/app/blogs/components/blog-form";
import { Navbar } from "@/components/navbar/navbar";

export default function CreateBlogPage() {
  // Auth logic removed. Always show form.
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BlogForm mode="create" />
    </div>
  );
}
