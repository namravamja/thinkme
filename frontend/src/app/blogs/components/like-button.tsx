"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  blogId: string;
  initialLiked: boolean;
  initialCount: number;
  size?: "sm" | "default";
}

export function LikeButton({
  blogId,
  initialLiked,
  initialCount,
  size = "sm",
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    const newLiked = !isLiked;
    const newCount = newLiked ? likesCount + 1 : likesCount - 1;
    setIsLiked(newLiked);
    setLikesCount(newCount);

    try {
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount(initialCount);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleLike}
      className={cn(
        "flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-all duration-200 cursor-pointer hover:scale-105",
        isLiked && "text-red-500"
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-200",
          isLiked && "fill-current scale-110"
        )}
      />
      <span className="text-sm font-medium">{likesCount}</span>
    </Button>
  );
}
