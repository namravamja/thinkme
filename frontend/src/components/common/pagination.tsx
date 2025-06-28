"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  const goToPage = (page: number) => {
    router.push(createPageURL(page));
  };

  if (totalPages <= 1) return null;

  // Calculate visible page numbers for mobile
  const getVisiblePages = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const maxVisible = isMobile ? 3 : 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= Math.ceil(maxVisible / 2)) {
      return Array.from({ length: maxVisible }, (_, i) => i + 1);
    }

    if (currentPage >= totalPages - Math.floor(maxVisible / 2)) {
      return Array.from(
        { length: maxVisible },
        (_, i) => totalPages - maxVisible + 1 + i
      );
    }

    const start = currentPage - Math.floor(maxVisible / 2);
    return Array.from({ length: maxVisible }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-8 sm:h-9 px-2 sm:px-3 cursor-pointer hover:bg-accent/50 transition-colors disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline ml-1">Previous</span>
      </Button>

      <div className="flex items-center space-x-1">
        {visiblePages.map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            size="sm"
            onClick={() => goToPage(pageNumber)}
            className="h-8 w-8 sm:h-9 sm:w-9 p-0 text-xs sm:text-sm cursor-pointer hover:bg-accent/50 transition-colors"
          >
            {pageNumber}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-8 sm:h-9 px-2 sm:px-3 cursor-pointer hover:bg-accent/50 transition-colors disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
}
