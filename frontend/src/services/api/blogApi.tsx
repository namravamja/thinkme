import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_API_URL = "http://localhost:8000";

export const BlogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}/blogs`, // matches FastAPI routes like "/blogs/"
    credentials: "include", // include cookies like access_token
  }),
  tagTypes: ["Blog"],

  endpoints: (builder) => ({
    // ✅ Create Blog (POST /blogs/)
    createBlog: builder.mutation({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),

    // ✅ Update Blog (PUT /blogs/{id})
    updateBlog: builder.mutation({
      query: ({ blogId, formData }) => ({
        url: `/${blogId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),

    // ✅ Delete Blog (DELETE /blogs/{id})
    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    // ✅ Optional - Get single blog
    getBlog: builder.query({
      query: (blogId) => `/${blogId}`,
      providesTags: ["Blog"],
    }),

    // ✅ Optional - Get all blogs
    getBlogs: builder.query({
      query: () => `/list`, // Adjust if needed
      providesTags: ["Blog"],
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogQuery,
  useGetBlogsQuery,
} = BlogApi;
