import { mainApi } from "../../app/mainApi.js";



const reviewApi = mainApi.injectEndpoints({

  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (id) => ({
        url: `/reviews/products/${id}`,
        method: 'GET'
      }),
      providesTags: ['Review']
    }),

    addReview: builder.mutation({
      query: (data) => ({
        url: `/reviews/${data.id}`,
        method: 'POST',
        body: data.body,
        headers: {
          Authorization: data.token
        }
      }),
      invalidatesTags: ['Review']
    }),
  }),
});


export const { useGetReviewsQuery, useAddReviewMutation } = reviewApi;