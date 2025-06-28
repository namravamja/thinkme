"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const trendingTopics = [
  { name: "Web Development", count: 24 },
  { name: "React", count: 18 },
  { name: "JavaScript", count: 15 },
  { name: "UI/UX", count: 12 },
  { name: "CSS", count: 10 },
  { name: "TypeScript", count: 8 },
  { name: "Next.js", count: 7 },
  { name: "Design", count: 6 },
]

export function TrendingTopics() {
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
              key={topic.name}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs sm:text-sm px-2 py-1"
            >
              {topic.name} ({topic.count})
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
