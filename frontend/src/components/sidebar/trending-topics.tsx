"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

const trendingTopics = [
  "Web Development",
  "React",
  "JavaScript",
  "UI/UX",
  "CSS",
  "TypeScript",
  "Next.js",
  "Design",
];

export function TrendingTopics() {
  const router = useRouter();

  const handleTopicClick = (topic: string | number | boolean) => {
    router.push(`/blogs?search=${encodeURIComponent(topic)}&page=1`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-slate-900 dark:text-slate-100">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {trendingTopics.map((topic) => (
            <Badge
              key={topic}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs sm:text-sm px-2 py-1"
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
