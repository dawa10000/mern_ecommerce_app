import { mainApi } from "../../app/mainApi.js";

const orderApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: (token) => ({
        url: '/checkout/my-orders',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['Order'],
    }),
    cancelOrder: builder.mutation({
      query: ({ id, token }) => ({
        url: `/checkout/${id}/cancel`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useGetMyOrdersQuery, useCancelOrderMutation } = orderApi;
export default orderApi;