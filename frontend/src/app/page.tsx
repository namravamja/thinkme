"use client";

import { Navbar } from "@/components/navbar/navbar";
import { BlogList } from "@/app/blogs/components/blog-list";
import { FeaturedBlogs } from "@/app/blogs/components/featured-blogs";
import { CategorySidebar } from "@/components/sidebar/category-sidebar";
import { TrendingTopics } from "@/components/sidebar/trending-topics";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    searchParams.get("category") || undefined
  );
  const page = Number.parseInt(searchParams.get("page") || "1");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl py-16 lg:py-24 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-slate-900 dark:text-slate-100">
            Human stories & ideas
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            A place to read, write, and deepen your understanding
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-3 text-lg cursor-pointer hover:scale-105 transition-transform duration-200"
          >
            <Link href="/blogs">
              Start reading
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Featured Stories
            </h2>
          </div>
          <FeaturedBlogs />
        </div>
      </section>

      <Separator />

      {/* Main Content */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <TrendingTopics />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Latest Stories
              </h2>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="cursor-pointer hover:bg-accent/50 transition-colors bg-transparent"
              >
                <Link href="/blogs">
                  Explore More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <BlogList page={page} category={selectedCategory} limit={3} />
          </main>
        </div>
      </div>
    </div>
  );
}
