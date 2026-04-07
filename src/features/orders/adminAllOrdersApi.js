import { mainApi } from "../../app/mainApi.js";

const adminAllOrdersApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (token) => ({
        url: '/checkout/all-orders',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['Order'],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ token, orderId, status }) => ({
        url: `/checkout/order/${orderId}/status`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const { useGetAllOrdersQuery, useUpdateOrderStatusMutation } = adminAllOrdersApi;
export default adminAllOrdersApi;