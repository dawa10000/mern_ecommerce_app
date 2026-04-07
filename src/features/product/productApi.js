import { mainApi } from "../../app/mainApi.js";





const productApi = mainApi.injectEndpoints({

  endpoints: (builder) => ({


    getProducts: builder.query({
      query: (query) => ({
        url: '/products',
        method: 'GET',
        params: query
      }),
      providesTags: ['Product']
    }),

    getTop5: builder.query({
      query: () => ({
        url: '/products/top-5',
        method: 'GET'
      }),
      providesTags: ['Product']
    }),

    getProduct: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET'
      }),
      providesTags: ['Product']
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data.body,
        headers: {
          Authorization: `Bearer ${data.token}`
        }
      }),
      invalidatesTags: ['Product']
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `/products/${data.id}`,
        method: 'PATCH',
        body: data.body,
        headers: {
          Authorization: `Bearer ${data.token}`
        }
      }),
      invalidatesTags: ['Product']
    }),

    removeProduct: builder.mutation({
      query: (data) => ({
        url: `/products/${data.id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${data.token}`
        }
      }),
      invalidatesTags: ['Product']
    }),


  })

})


export const { useGetProductsQuery, useCreateProductMutation, useRemoveProductMutation, useGetProductQuery, useUpdateProductMutation, useGetTop5Query } = productApi;