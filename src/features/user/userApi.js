import { mainApi } from "../../app/mainApi.js";





const userApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({


    getUser: builder.query({
      query: (token) => ({
        url: '/users/profile',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      providesTags: ['User']
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: '/users/profile',
        method: 'PATCH',
        body: data.body,
        headers: {
          Authorization: `Bearer ${data.token}`
        }
      }),
      invalidatesTags: ['User']
    })



  }),
})


export const { useGetUserQuery, useUpdateUserMutation } = userApi;