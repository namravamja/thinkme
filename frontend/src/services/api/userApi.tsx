import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_API_URL = "http://localhost:8000";

export const UserApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => "/me",
    }),

    updateUser: builder.mutation({
      query: (formData) => ({
        url: "/me/update",
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const { useGetCurrentUserQuery, useUpdateUserMutation } = UserApi;
