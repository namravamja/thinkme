import { UserApi } from "./../../services/api/userApi";
import { BlogApi } from "./../../services/api/blogApi";
import { AuthApi } from "./../../services/api/authApi";
import { configureStore } from "@reduxjs/toolkit";
import "@/services/api/authApi"; // This ensures auth endpoints are injected into the base api

export const makeStore = () =>
  configureStore({
    reducer: {
      [BlogApi.reducerPath]: BlogApi.reducer,
      [UserApi.reducerPath]: UserApi.reducer,
      [AuthApi.reducerPath]: AuthApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        BlogApi.middleware,
        UserApi.middleware,
        AuthApi.middleware
      ),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
