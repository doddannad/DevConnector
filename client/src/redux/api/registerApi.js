import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Types";

export const registerApi = createApi({
  reducerPath: "register",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    registration: builder.mutation({
      query: ({ name, email, password }) => ({
        url: "/users",
        method: "POST",
        body: { name, email, password },
      }),
    }),
  }),
});

export const { useRegistrationMutation } = registerApi;
