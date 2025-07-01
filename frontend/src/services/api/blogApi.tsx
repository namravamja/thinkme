import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_API_URL = "http://localhost:8000";

export const BlogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}`, // matches FastAPI routes like "/blogs/"
    credentials: "include", // include cookies like access_token
  }),
  tagTypes: ["Blog"],

  endpoints: (builder) => ({
    // ✅ Create Blog (POST /blogs/)
    createBlog: builder.mutation({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),

    // ✅ Update Blog (PUT /blogs/{id})
    updateBlog: builder.mutation({
      query: ({ blogId, formData }) => ({
        url: `/update/${blogId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),

    getUserBlogs: builder.query({
      query: () => `/my-blogs`,
    }),

    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `/delete/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    getBlog: builder.query({
      query: (blogId) => `/get/${blogId}`,
      providesTags: ["Blog"],
    }),

    getBlogs: builder.query({
      query: () => `/all`, // Adjust if needed
      providesTags: ["Blog"],
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogQuery,
  useGetUserBlogsQuery,
  useGetBlogsQuery,
} = BlogApi;
