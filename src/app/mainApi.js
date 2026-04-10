import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



export const baseUrl = 'http://localhost:5000/api';
export const base = 'http://localhost:5000';


// export const baseUrl = 'https://mern-ecommerce-app-2aug.onrender.com/api';
// export const base = 'https://mern-ecommerce-app-2aug.onrender.com';

export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({ baseUrl, credentials: 'include' }),
  tagTypes: ['Product', 'User', 'Order'],
  endpoints: (builder) => ({})
});



