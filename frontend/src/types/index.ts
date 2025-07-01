export interface User {
  id: number;
  email: string;
  name: string;
  bio?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  profile_image?: string;
}

export interface Blog {
  title?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  image?: string;
  id: number;
  user_id?: number;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface BlogsResponse {
  blogs: Blog[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
}

export interface UpdateBlogData extends CreateBlogData {
  id: string;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Like {
  id: string;
  userId: string;
  blogId?: string;
  commentId?: string;
  createdAt: string;
}
