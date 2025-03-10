import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login : builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
        }),
    }),
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
        }),
    }),
        getUsers: builder.query({
            query: () => ({
                url: USERS_URL,
                method: 'GET', 
        }),
        providesTags:['Users'],
        keepUnusedDataFor: 5
    }),
   
    deleteUser: builder.mutation({
        query: (userId) => ({
            url: `${USERS_URL}/${userId}`,
            method: 'DELETE',
        }),
    }), 
    getUserDetails: builder.query({
        query: (id) => ({
          url: `${USERS_URL}/${id}`,
        }),
        keepUnusedDataFor: 5,
      }),
    updateUser: builder.mutation({
        query: (data) => ({
          url: `${USERS_URL}/${data.userId}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['User'],
      }),
      forgotPassword: builder.mutation({
        query: (email) => ({
          url: `${USERS_URL}/forgot-password`,
          method: 'POST',
          body: { email },
        }),
        invalidatesTags: ['User'],

      }),
      resetPassword: builder.mutation({
        query: ({ token, newPassword }) => ({
          url: `${USERS_URL}/reset-password`,
          method: 'POST',
          body: { token, newPassword },
        }),
        invalidatesTags: ['User'],

      }),
})
})
export const {useLoginMutation, 
              useLogoutMutation,
              useRegisterMutation,
              useProfileMutation,
              useGetUsersQuery,
              useDeleteUserMutation,
              useGetUserDetailsQuery,
              useUpdateUserMutation,
              useForgotPasswordMutation,
              useResetPasswordMutation
            } = usersApiSlice;