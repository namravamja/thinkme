"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface CategorySidebarProps {
  selectedCategory?: string;
  onCategoryChange: (category?: string) => void;
}

export function CategorySidebar({
  selectedCategory,
  onCategoryChange,
}: CategorySidebarProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg text-slate-900 dark:text-slate-100">
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 sm:space-y-2">
        <Button
          variant={!selectedCategory ? "default" : "ghost"}
          className="w-full justify-start text-sm sm:text-base h-8 sm:h-9"
          onClick={() => onCategoryChange()}
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "ghost"}
            className="w-full justify-start text-sm sm:text-base h-8 sm:h-9"
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
