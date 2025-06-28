"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { BlogList } from "@/app/blogs/components/blog-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

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

export default function AllBlogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const page = Number.parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    if (category !== selectedCategory) {
      setSelectedCategory(category);
    }
    if (search !== searchQuery) {
      setSearchQuery(search || "");
      setLocalSearch(search || "");
    }
  }, [searchParams]);

  const updateURL = (newCategory?: string | null, newSearch?: string) => {
    const params = new URLSearchParams();
    if (newCategory) params.set("category", newCategory);
    if (newSearch) params.set("search", newSearch);
    if (page > 1) params.set("page", "1"); // Reset to first page on filter change

    const queryString = params.toString();
    router.push(`/blogs${queryString ? `?${queryString}` : ""}`);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    updateURL(category, searchQuery || undefined);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    updateURL(selectedCategory, localSearch || undefined);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setLocalSearch("");
    router.push("/blogs");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            All Stories
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Discover stories, thinking, and expertise from writers on any topic
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button type="submit" size="lg" className="px-6">
              Search
            </Button>
          </form>

          {/* Category Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <h3 className="font-medium text-slate-900 dark:text-slate-100">
                Categories
              </h3>
              {(selectedCategory || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-slate-600 dark:text-slate-400"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!selectedCategory ? "default" : "secondary"}
                className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 ${
                  !selectedCategory
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
                onClick={() => handleCategoryChange(null)}
              >
                All Categories
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "secondary"
                  }
                  className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 ${
                    selectedCategory === category
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || searchQuery) && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span>Active filters:</span>
              {selectedCategory && (
                <Badge variant="outline" className="gap-1">
                  Category: {selectedCategory}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleCategoryChange(null)}
                  />
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="outline" className="gap-1">
                  Search: "{searchQuery}"
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setSearchQuery("");
                      setLocalSearch("");
                      updateURL(selectedCategory, undefined);
                    }}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Blog List */}
        <BlogList
          page={page}
          category={selectedCategory || undefined}
          search={searchQuery || undefined}
        />
      </div>
    </div>
  );
}
