import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_API_URL = "http://localhost:8000";

export const AuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData,
      }),
    }),

    // ✅ Login - POST /login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // ✅ Logout - POST /logout
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation } =
  AuthApi;
