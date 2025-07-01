"use client";

import type React from "react";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { BlogList } from "@/app/blogs/components/blog-list";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { useGetBlogsQuery } from "@/services/api/blogApi";

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function AllBlogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: apiData, isLoading: categoriesLoading } =
    useGetBlogsQuery(undefined);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null
  );
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  // Debounce search input for optimal performance
  const debouncedSearch = useDebounce(searchInput, 300);

  const page = Number.parseInt(searchParams.get("page") || "1");

  // Extract unique categories from API data
  const categories = useMemo(() => {
    if (!apiData) return [];

    const uniqueCategories = Array.from(
      new Set(apiData.map((blog: any) => blog.category).filter(Boolean))
    ).sort();

    return uniqueCategories;
  }, [apiData]);

  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    if (category !== selectedCategory) {
      setSelectedCategory(category);
    }
    if (search !== searchInput) {
      setSearchInput(search || "");
    }
  }, [searchParams]);

  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== searchParams.get("search")) {
      updateURL(selectedCategory, debouncedSearch || undefined);
    }
  }, [debouncedSearch, selectedCategory]);

  const updateURL = useCallback(
    (newCategory?: string | null, newSearch?: string) => {
      const params = new URLSearchParams();
      if (newCategory) params.set("category", newCategory);
      if (newSearch) params.set("search", newSearch);
      // Always reset to first page on filter change
      params.set("page", "1");

      const queryString = params.toString();
      router.push(`/blogs${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [router]
  );

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    updateURL(category, debouncedSearch || undefined);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchInput("");
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
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by title or tags..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <h3 className="font-medium text-slate-900 dark:text-slate-100">
                Categories
              </h3>
              {(selectedCategory || debouncedSearch) && (
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

              {categoriesLoading
                ? // Show skeleton badges while loading
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full px-4 py-2 w-20"></div>
                    </div>
                  ))
                : categories.map((category) => (
                    <Badge
                      key={category as string}
                      variant={
                        selectedCategory === category ? "default" : "secondary"
                      }
                      className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 ${
                        selectedCategory === category
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                          : "hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                      onClick={() => handleCategoryChange(category as string)}
                    >
                      {String(category)}
                    </Badge>
                  ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || debouncedSearch) && (
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
              {debouncedSearch && (
                <Badge variant="outline" className="gap-1">
                  Search: "{debouncedSearch}"
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setSearchInput("");
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
          search={debouncedSearch || undefined}
        />
      </div>
    </div>
  );
}
