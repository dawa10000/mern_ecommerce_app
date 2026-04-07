import { mainApi } from "../../app/mainApi.js";

const checkoutApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckout: builder.mutation({
      query: (data) => ({
        url: '/checkout',
        method: 'POST',
        body: data.body,
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const { useCreateCheckoutMutation } = checkoutApi;
export default checkoutApi;