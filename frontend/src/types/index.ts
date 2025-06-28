export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image: string[];
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  readTime: number;
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
