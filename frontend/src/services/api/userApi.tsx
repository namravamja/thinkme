import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_API_URL = "http://localhost:8000"; // adjust to your actual backend

export const UserApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}`, // assuming FastAPI router is mounted at /user
    credentials: "include", // for cookies like access_token
  }),
  endpoints: (builder) => ({
    // ✅ Get current user info from cookie token
    getCurrentUser: builder.query({
      query: () => "/me",
    }),
  }),
});

export const { useGetCurrentUserQuery } = UserApi;
