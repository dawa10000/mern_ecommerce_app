import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const baseUrl = import.meta.env.PROD
  ? 'https://mern-ecommerce-app-2aug.onrender.com/api'
  : 'http://localhost:5000/api';
export const base = import.meta.env.PROD
  ? 'https://mern-ecommerce-app-2aug.onrender.com'
  : 'http://localhost:5000';


export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({ baseUrl, credentials: 'include' }),
  tagTypes: ['Product', 'User', 'Order'],
  endpoints: (builder) => ({})
});



