"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useGetCommentsQuery, useAddCommentMutation, useToggleCommentLikeMutation } from "@/lib/api/blogApi"
import { useAppSelector } from "@/lib/hooks"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle } from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

interface CommentSectionProps {
  blogId: string
}

export function CommentSection({ blogId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const { user } = useAppSelector((state) => state.auth)

  const { data: comments = [], isLoading } = useGetCommentsQuery(blogId)
  const [addComment, { isLoading: isAdding }] = useAddCommentMutation()
  const [toggleCommentLike] = useToggleCommentLikeMutation()

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    if (!user) {
      toast.error("Please login to comment")
      return
    }

    try {
      await addComment({ blogId, content: newComment }).unwrap()
      setNewComment("")
      toast.success("Comment added!")
    } catch (error) {
      toast.error("Failed to add comment")
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast.error("Please login to like comments")
      return
    }

    try {
      await toggleCommentLike({ commentId, blogId }).unwrap()
    } catch (error) {
      toast.error("Failed to like comment")
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
          Comments ({comments.length})
        </h3>
      </div>

      {user && (
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="text-xs">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="resize-none text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={!newComment.trim() || isAdding} size="sm">
                  {isAdding ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3 sm:space-y-4">
        {isLoading ? (
          <div className="text-center py-6 sm:py-8 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-3 sm:pt-4">
                <div className="flex gap-3">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                    <AvatarFallback className="text-xs">{comment.author.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                      <span className="font-medium text-xs sm:text-sm truncate text-slate-900 dark:text-slate-100">
                        {comment.author.name}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base mb-3 leading-relaxed text-slate-800 dark:text-slate-200">
                      {comment.content}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikeComment(comment.id)}
                      className={cn(
                        "flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors h-7 sm:h-8 px-2",
                        comment.isLiked && "text-red-500",
                      )}
                    >
                      <Heart className={cn("h-3 w-3 transition-all", comment.isLiked && "fill-current")} />
                      <span className="text-xs">{comment.likesCount}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
