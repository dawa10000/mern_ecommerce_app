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
  }),
});

export const { useGetMyOrdersQuery } = orderApi;
export default orderApi;